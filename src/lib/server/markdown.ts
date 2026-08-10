import { marked, type RendererObject, type Tokens } from 'marked';
import hljs from 'highlight.js';

export interface Heading {
  level: number;
  text: string;
  id: string;
}

const CALLOUT_TYPES = ['info', 'tip', 'warning', 'danger'] as const;
type CalloutType = (typeof CALLOUT_TYPES)[number];

function isCalloutType(s: string): s is CalloutType {
  return CALLOUT_TYPES.includes(s as CalloutType);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}

function isVideoFile(input: string): boolean {
  return /\.(mp4|webm|mov|mkv|ogv)(\?.*)?$/i.test(input);
}

export function renderMarkdown(rawContent: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const usedIds = new Set<string>();

  function makeUniqueId(text: string): string {
    let base = slugify(text).replace(/^-+|-+$/g, '') || 'section';
    let id = base;
    let counter = 2;
    while (usedIds.has(id)) {
      id = `${base}-${counter++}`;
    }
    usedIds.add(id);
    return id;
  }

  function processCallouts(src: string): string {
    const calloutRegex = new RegExp(`^:::(${CALLOUT_TYPES.join('|')})(\\s+[^\\n]*)?\\n`, 'gm');
    const videoRegex = /^:::(youtube|video)\s+([^\n]+)$/gim;

    let result = src.replace(calloutRegex, (_, type: string, titleRaw: string | undefined) => {
      const title = titleRaw?.trim() || type.charAt(0).toUpperCase() + type.slice(1);
      return `<div class="callout callout-${type}"><div class="callout-title">${title}</div><div class="callout-content">\n`;
    });

    result = result.replace(videoRegex, (_, type: string, value: string) => {
      const trimmed = value.trim();
      if (type === 'youtube') {
        const id = extractYouTubeId(trimmed);
        if (!id) return `<div class="docs-video"><div class="docs-video-fallback"><p>ID de YouTube no válido: <code>${escapeHtml(trimmed)}</code></p></div></div>`;
        return `<div class="docs-video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
      }
      if (isVideoFile(trimmed)) {
        return `<div class="docs-video"><video controls preload="metadata"><source src="${escapeHtml(trimmed)}" /><p>Tu navegador no soporta la reproducción de video.</p></video></div>`;
      }
      if (/^https?:\/\//.test(trimmed)) {
        return `<div class="docs-video"><video controls preload="metadata"><source src="${escapeHtml(trimmed)}" /><p>Tu navegador no soporta la reproducción de video.</p></video></div>`;
      }
      return `<div class="docs-video"><div class="docs-video-fallback"><p>Formato de video no reconocido: <code>${escapeHtml(trimmed)}</code></p></div></div>`;
    });

    result = result.replace(/^:::[ \t]*$/gm, '</div></div>');

    return result;
  }

  function wrapImages(src: string): string {
    // Find <img> tags that are not already inside a <button class="docs-lightbox-trigger"> or <a>.
    // Use a placeholder approach to avoid double-wrapping.
    return src.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, (match, before, src, after) => {
      const hasLightbox = /class="[^"]*docs-lightbox-img|docs-lightbox/.test(match) || /class="[^"]*no-lightbox/.test(match);
      const altMatch = match.match(/alt="([^"]*)"/i);
      const alt = altMatch ? altMatch[1] : '';
      const safeSrc = escapeHtml(src);
      if (hasLightbox) return match;
      return `<button type="button" class="docs-lightbox-trigger" data-src="${safeSrc}" data-alt="${escapeHtml(alt)}" aria-label="Ampliar imagen"><img${before}src="${src}"${after}></button>`;
    });
  }

  function svgIcon(name: string): string {
    const icons: Record<string, string> = {
      copy: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
      check: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };
    return icons[name] || '';
  }

  const renderer: RendererObject = {
    heading({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens) as string;
      const id = makeUniqueId(text.replace(/<[^>]+>/g, ''));
      headings.push({ level: depth, text, id });
      return `<h${depth} id="${id}"><a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>${text}</h${depth}>`;
    },

    code({ text, lang }: Tokens.Code) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      let highlighted: string;
      try {
        highlighted = language === 'plaintext'
          ? hljs.highlightAuto(text).value
          : hljs.highlight(text, { language }).value;
      } catch {
        highlighted = hljs.highlightAuto(text).value;
      }

      const safeCode = escapeHtml(text);

      return (
        `<div class="code-block">` +
          `<div class="code-block-header">` +
            `<span class="code-block-lang">${language}</span>` +
            `<button class="code-block-copy" type="button" data-code="${safeCode}" aria-label="Copiar código">` +
              `<span class="copy-icon">${svgIcon('copy')}</span>` +
              `<span class="check-icon">${svgIcon('check')}</span>` +
              `<span class="copy-text">Copiar</span>` +
            `</button>` +
          `</div>` +
          `<pre><code class="hljs language-${language}">${highlighted}</code></pre>` +
        `</div>`
      );
    },

    image({ href, title, text }: Tokens.Image) {
      const safeHref = escapeHtml(href);
      const safeAlt = escapeHtml(text || title || '');
      const safeTitle = title ? ` title="${escapeHtml(title)}"` : '';
      const img = `<img class="docs-lightbox-img" src="${safeHref}" alt="${safeAlt}"${safeTitle} loading="lazy" />`;
      return `<button type="button" class="docs-lightbox-trigger" data-src="${safeHref}" data-alt="${safeAlt}" aria-label="Ampliar imagen">${img}</button>`;
    },

    link({ href, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens) as string;
      const isExternal = /^https?:\/\//.test(href);
      const isHash = href.startsWith('#');
      const attrs = isExternal
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      let finalHref = href;
      if (!isExternal && !isHash && !href.startsWith('/docs/') && !href.startsWith('/')) {
        finalHref = '/docs/' + href.replace(/^\//, '');
      }
      return `<a href="${finalHref}"${attrs}>${text}</a>`;
    },

    blockquote({ tokens }: Tokens.Blockquote) {
      const body = this.parser.parse(tokens);
      return `<blockquote>${body}</blockquote>`;
    }
  };

  marked.use({ renderer });

  const processed = processCallouts(rawContent);
  const html = marked.parse(processed, { async: false }) as string;
  const wrapped = wrapImages(html);

  return { html: wrapped, headings };
}
