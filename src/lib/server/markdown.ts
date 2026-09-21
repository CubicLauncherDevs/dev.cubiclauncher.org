import { Marked, type RendererObject, type Tokens } from 'marked';
import hljs from 'highlight.js';

export interface Heading {
  level: number;
  text: string;
  id: string;
}

const BLOCK_TYPES = ['info', 'tip', 'warning', 'danger', 'details', 'related', 'expansion'] as const;
type BlockType = (typeof BLOCK_TYPES)[number];

function isBlockType(s: string): s is BlockType {
  return BLOCK_TYPES.includes(s as BlockType);
}

function blockTitle(type: BlockType, raw: string | undefined): string {
  if (raw && raw.trim()) return raw.trim();
  if (type === 'details') return 'Detalles';
  if (type === 'related') return 'Artículos relacionados';
  if (type === 'expansion') return 'Esta página necesita expansión';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function wrapBlock(type: BlockType, title: string, html: string): string {
  if (type === 'details') {
    return (
      `<details class="docs-details">` +
      `<summary class="docs-summary">${escapeHtml(title)}</summary>` +
      `<div class="docs-details-content">${html}</div>` +
      `</details>`
    );
  }
  if (type === 'related') {
    return (
      `<aside class="wiki-related">` +
      `<div class="wiki-related-title">${svgIcon('related')}<span>${escapeHtml(title)}</span></div>` +
      `<div class="wiki-related-content">${html}</div>` +
      `</aside>`
    );
  }
  if (type === 'expansion') {
    return (
      `<div class="wiki-expansion">` +
      `<div class="wiki-expansion-icon">${svgIcon('expansion')}</div>` +
      `<div class="wiki-expansion-body">` +
      `<div class="wiki-expansion-title">${escapeHtml(title)}</div>` +
      `<div class="wiki-expansion-content">${html}</div>` +
      `</div>` +
      `</div>`
    );
  }
  return (
    `<div class="callout callout-${type}">` +
    `<div class="callout-title"><span class="callout-icon">${svgIcon(type)}</span>${escapeHtml(title)}</div>` +
    `<div class="callout-content">${html}</div>` +
    `</div>`
  );
}

function svgIcon(name: string): string {
  const icons: Record<string, string> = {
    copy: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    tip: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    danger: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
    related: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    expansion: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polygon points="14 2 14 8 20 8"></polygon><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>',
  };
  return icons[name] || '';
}

function processVideos(src: string): string {
  const videoRegex = /^:::(youtube|video)\s+([^\n]+)$/gim;

  return src.replace(videoRegex, (_, type: string, value: string) => {
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
}

/**
 * Aplica una transformación solo a las líneas fuera de bloques de código
 * cercados (``` / ~~~), para no alterar ejemplos que contengan {{ }}.
 */
function mapOutsideFences(src: string, fn: (segment: string) => string): string {
  const fenceRe = /^ *(```|~~~)/;
  const lines = src.split('\n');
  const out: string[] = [];
  let buf: string[] = [];
  let inFence = false;

  const flush = () => {
    if (buf.length) {
      out.push(fn(buf.join('\n')));
      buf = [];
    }
  };

  for (const line of lines) {
    if (fenceRe.test(line)) {
      flush();
      out.push(line);
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    buf.push(line);
  }
  flush();
  return out.join('\n');
}

/**
 * Plantillas en línea estilo Arch Wiki:
 *   {{ic|code}}        → código en línea
 *   {{kbd|Ctrl}}       → tecla
 *   {{bc|bloque}}      → bloque de código sin lenguaje
 *   {{hc|prompt|cmd}}  → bloque con cabecera (archivo/prompt)
 *   {{Note|texto}} {{Tip|texto}} {{Warning|texto}} → notas en línea
 */
function processInlineTemplates(segment: string): string {
  return segment
    .replace(/\{\{ic\|([\s\S]*?)\}\}/g, (_, t: string) => `<code>${escapeHtml(t.trim())}</code>`)
    .replace(/\{\{kbd\|([\s\S]*?)\}\}/g, (_, t: string) => `<kbd class="wiki-kbd">${escapeHtml(t.trim())}</kbd>`)
    .replace(/\{\{(Note|Tip|Warning)\|([\s\S]*?)\}\}/g, (_, kind: string, t: string) =>
      `<span class="wiki-inline-note wiki-inline-${kind.toLowerCase()}"><strong>${kind}:</strong> ${t.trim()}</span>`)
    .replace(/\{\{bc\|([\s\S]*?)\}\}/g, (_, t: string) =>
      `\n<pre class="wiki-bc"><code>${escapeHtml(t.replace(/^\n+|\n+$/g, ''))}</code></pre>\n`)
    .replace(/\{\{hc\|([^|\n]*)\|([\s\S]*?)\}\}/g, (_, h: string, t: string) =>
      `\n<pre class="wiki-bc wiki-hc"><code><span class="wiki-hc-header">${escapeHtml(h.trim())}</span>${escapeHtml(t.replace(/^\n/, ''))}</code></pre>\n`);
}

function processCustomBlocks(src: string, markedInstance: Marked): string {
  const openRe = /^:::(\w+)(?:\s+(.*))?$/;
  const closeRe = /^:::[ \t]*$/;
  const fenceRe = /^ *```/;
  const lines = src.split('\n');
  const out: string[] = [];
  let i = 0;
  let inFence = false;

  while (i < lines.length) {
    const line = lines[i];

    if (!inFence && fenceRe.test(line)) {
      inFence = true;
      out.push(line);
      i++;
      continue;
    }
    if (inFence && fenceRe.test(line)) {
      inFence = false;
      out.push(line);
      i++;
      continue;
    }

    if (!inFence) {
      const openMatch = line.match(openRe);
      if (openMatch && isBlockType(openMatch[1])) {
        const type = openMatch[1] as BlockType;
        const title = blockTitle(type, openMatch[2]);
        let depth = 1;
        const innerLines: string[] = [];
        let j = i + 1;
        while (j < lines.length && depth > 0) {
          const l = lines[j];
          const lOpen = l.match(openRe);
          if (lOpen && isBlockType(lOpen[1])) {
            depth++;
          } else if (closeRe.test(l)) {
            depth--;
            if (depth === 0) break;
          }
          innerLines.push(l);
          j++;
        }
        const inner = innerLines.join('\n');
        const processedInner = processCustomBlocks(inner, markedInstance);
        const html = markedInstance.parse(processedInner, { async: false }) as string;
        out.push(wrapBlock(type, title, html));
        i = j + 1;
        continue;
      }
    }

    out.push(line);
    i++;
  }

  return out.join('\n');
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

export interface RenderOptions {
  /** URL base de GitHub para enlaces «editar sección» (sin el archivo) */
  editBase?: string;
  /** Ruta del archivo dentro del idioma, ej: 'Uso/instances.md' */
  filePath?: string;
}

export function renderMarkdown(rawContent: string, opts: RenderOptions = {}): { html: string; headings: Heading[] } {
  const sectionEditBase = opts.editBase && opts.filePath ? `${opts.editBase}/${opts.filePath}` : null;
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

  const renderer: RendererObject = {
    heading({ tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens) as string;
      const id = makeUniqueId(text.replace(/<[^>]+>/g, ''));
      headings.push({ level: depth, text, id });
      const edit = sectionEditBase
        ? `<a href="${sectionEditBase}" target="_blank" rel="noopener noreferrer" class="section-edit" aria-label="Editar esta sección" title="Editar esta sección"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg><span>editar</span></a>`
        : '';
      return `<h${depth} id="${id}"><a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>${text}${edit}</h${depth}>`;
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
          // data-lang se usa para estilizar la «pill» del lenguaje en CSS
          `<div class="code-block-header" data-lang="${language}">` +
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
    },

    table({ header, rows }: Tokens.Table) {
      // Tabla con rejilla completa, estilo Arch Wiki
      const thead = header
        .map(cell => {
          const text = this.parser.parseInline(cell.tokens) as string;
          const align = cell.align ? ` style="text-align:${cell.align}"` : '';
          return `<th${align}>${text}</th>`;
        })
        .join('');
      const tbody = rows
        .map(row =>
          '<tr>' +
          row.map(cell => `<td>${this.parser.parseInline(cell.tokens) as string}</td>`).join('') +
          '</tr>'
        )
        .join('');
      return (
        `<div class="wiki-table-wrap">` +
        `<table class="wiki-table"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>` +
        `</div>`
      );
    }
  };

  const marked = new Marked();
  marked.use({ renderer });

  const withVideos = processVideos(rawContent);
  const withTemplates = mapOutsideFences(withVideos, processInlineTemplates);
  const processed = processCustomBlocks(withTemplates, marked);
  const html = marked.parse(processed, { async: false }) as string;
  const wrapped = wrapImages(html);

  return { html: wrapped, headings };
}
