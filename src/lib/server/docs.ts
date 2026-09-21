import { renderMarkdown } from './markdown';
import type { Heading } from './markdown';

interface DocEntry {
  lang: string;
  category: string;
  slug: string;
  content: string;
}

export interface DocNode {
  label: string;
  slug?: string;
  children?: DocNode[];
  code?: string;
  editBase?: string;
}

export interface DocMeta {
  title: string;
  description: string;
  lang: string;
  category: string;
  slug: string;
  content: string;
  headings: Heading[];
  wikiTitle: string;
  wikiCategory: string;
  editBase: string;
}

/**
 * Parser de frontmatter tolerante: extrae `key: value` línea a línea.
 * A diferencia de un parser YAML estricto, tolera valores con «:» sueltos
 * (ej: `description: Vista de X: Y y Z`) en lugar de lanzar una excepción
 * que hacía que el frontmatter se renderizara como texto visible.
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const data: Record<string, string> = {};
  let content = raw;

  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---');
    if (end !== -1) {
      const block = raw.slice(3, end).trim();
      for (const line of block.split('\n')) {
        const m = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
        if (m) data[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      }
      content = raw.slice(end + 4).replace(/^\s*\n/, '');
    }
  }
  return { data, content };
}

function metaFor(entry: DocEntry): { title: string; description: string } {
  const { data } = parseFrontmatter(entry.content);
  const fallback = entry.slug.split('/').pop()?.replace(/-/g, ' ') || '';
  return {
    title: data.title?.split('|')[0]?.trim() || fallback,
    description: data.description || '',
  };
}

function wikiTitleFor(entry: DocEntry): string {
  return metaFor(entry).title;
}

const EDIT_BASES: Record<string, string> = {
  'es-ES': 'https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/edit/main/src/docs/es-ES',
  'en-EN': 'https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/edit/main/src/docs/en-EN',
  'fr-FR': 'https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/edit/main/src/docs/fr-FR',
};

function editBaseFor(lang: string): string {
  return EDIT_BASES[lang] || 'https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/edit/main/src/docs';
}

/** Sufijo de ruta dentro del idioma, ej: 'Uso/instances' */
function wikiCategoryFor(entry: DocEntry): string {
  return entry.slug.split('/').slice(1).join('/');
}

export interface SearchDoc {
  slug: string;
  lang: string;
  category: string;
  title: string;
  description: string;
  excerpt: string;
}

const modules = import.meta.glob('/src/docs/**/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const docsCache: DocEntry[] = Object.entries(modules).map(([filepath, rawContent]) => {
  const relative = filepath.replace('/src/docs/', '').replace(/\.md$/, '');
  const parts = relative.split('/');
  const lang = parts[0];
  const category = parts[1];
  return { lang, category, slug: relative, content: rawContent as string };
});

function langName(lang: string): string {
  const map: Record<string, string> = {
    'es-ES': 'Español',
    'en-EN': 'English',
    'fr-FR': 'Français',
  };
  return map[lang] || lang;
}

export function catDisplay(name: string): string {
  const map: Record<string, string> = {
    'Comenzando': 'Comenzando',
    'Pour-commencer': 'Pour commencer',
    'Getting-Started': 'Getting Started',
    'Uso': 'Uso',
    'Usage': 'Usage',
    'Utilisation': 'Utilisation',
    'guias': 'Guías',
    'guides': 'Guides',
    'Avanzado': 'Avanzado',
    'Avance': 'Avancé',
    'Advanced': 'Advanced',
    'Legal': 'Legal',
    'Clientes': 'Clientes',
    'Clients': 'Clients',
  };
  return map[name] || name;
}

export function getDocTree(): DocNode[] {
  const langOrder = ['es-ES', 'en-EN', 'fr-FR'];
  const catOrder = ['Comenzando', 'Getting-Started', 'Pour-commencer', 'Uso', 'Usage', 'Utilisation', 'Avanzado', 'Advanced', 'Avance', 'guias', 'guides', 'Clientes', 'Clients', 'Legal'];

  const langs = [...new Set(docsCache.map(d => d.lang))];
  langs.sort((a, b) => {
    const pa = langOrder.indexOf(a);
    const pb = langOrder.indexOf(b);
    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
  });

  const tree: DocNode[] = [];

  for (const lang of langs) {
    const langNode: DocNode = { label: langName(lang), code: lang, children: [], editBase: editBaseFor(lang) };
    const categories = [...new Set(docsCache.filter(d => d.lang === lang).map(d => d.category))];
    categories.sort((a, b) => {
      const pa = catOrder.indexOf(a);
      const pb = catOrder.indexOf(b);
      return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    });

    for (const cat of categories) {
      const catNode: DocNode = { label: catDisplay(cat), children: [] };
      const entries = docsCache.filter(d => d.lang === lang && d.category === cat);
      for (const entry of entries) {
        catNode.children!.push({ label: wikiTitleFor(entry), slug: entry.slug });
      }
      catNode.children?.sort((a, b) => a.label.localeCompare(b.label));
      langNode.children!.push(catNode);
    }
    tree.push(langNode);
  }
  return tree;
}

function getDocMeta(entry: DocEntry): { title: string; description: string; headings: Heading[]; content: string } {
  const { data, content } = parseFrontmatter(entry.content);
  const { html, headings } = renderMarkdown(content, {
    editBase: editBaseFor(entry.lang),
    filePath: wikiCategoryFor(entry) + '.md',
  });
  const meta = metaFor(entry);
  return { title: meta.title, description: meta.description, headings, content: html };
}

export function getDoc(slug: string): DocMeta | null {
  const docEntry = docsCache.find(d => d.slug === slug);
  if (!docEntry) return null;
  const meta = getDocMeta(docEntry);
  return {
    lang: docEntry.lang,
    category: docEntry.category,
    slug: docEntry.slug,
    title: meta.title,
    description: meta.description,
    headings: meta.headings,
    content: meta.content,
    wikiTitle: wikiTitleFor(docEntry),
    wikiCategory: wikiCategoryFor(docEntry),
    editBase: editBaseFor(docEntry.lang),
  };
}

/** Páginas de un idioma ordenadas alfabéticamente (índice estilo wiki) */
export function getAllPages(lang: string): { title: string; slug: string; category: string; categoryLabel: string }[] {
  return docsCache
    .filter(d => d.lang === lang)
    .map(d => ({
      title: wikiTitleFor(d),
      slug: d.slug,
      category: d.category,
      categoryLabel: catDisplay(d.category),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'es'));
}

export function getRandomPageSlug(lang?: string): string {
  const pool = lang ? docsCache.filter(d => d.lang === lang) : docsCache;
  const list = pool.length > 0 ? pool : docsCache;
  const pick = list[Math.floor(Math.random() * list.length)];
  return pick.slug;
}

export function getSearchIndex(): SearchDoc[] {
  return docsCache.map(entry => {
    const meta = metaFor(entry);
    const { data, content } = parseFrontmatter(entry.content);
    const { html } = renderMarkdown(content);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = text.slice(0, 160) + (text.length > 160 ? '…' : '');
    return {
      slug: entry.slug,
      lang: entry.lang,
      category: entry.category,
      title: meta.title,
      description: data.description || '',
      excerpt,
    };
  });
}
