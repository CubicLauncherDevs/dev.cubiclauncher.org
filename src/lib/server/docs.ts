import matter from 'gray-matter';
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
}

export interface DocMeta {
  title: string;
  description: string;
  lang: string;
  category: string;
  slug: string;
  content: string;
  headings: Heading[];
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

function catDisplay(name: string): string {
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
  };
  return map[name] || name;
}

export function getDocTree(): DocNode[] {
  const langOrder = ['es-ES', 'en-EN', 'fr-FR'];
  const catOrder = ['Comenzando', 'Getting-Started', 'Pour-commencer', 'Uso', 'Usage', 'Utilisation', 'Avanzado', 'Advanced', 'Avance', 'guias', 'guides', 'Legal'];

  const langs = [...new Set(docsCache.map(d => d.lang))];
  langs.sort((a, b) => {
    const pa = langOrder.indexOf(a);
    const pb = langOrder.indexOf(b);
    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
  });

  const tree: DocNode[] = [];

  for (const lang of langs) {
    const langNode: DocNode = { label: langName(lang), code: lang, children: [] };
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
        const fileName = entry.slug.split('/').pop() || '';
        let title = fileName.replace(/-/g, ' ');
        try {
          const { data } = matter(entry.content);
          if (data.title) title = data.title.split('|')[0].trim();
        } catch {}
        catNode.children!.push({ label: title, slug: entry.slug });
      }
      catNode.children?.sort((a, b) => a.label.localeCompare(b.label));
      langNode.children!.push(catNode);
    }
    tree.push(langNode);
  }
  return tree;
}

function getDocMeta(entry: DocEntry): { title: string; description: string; headings: Heading[]; content: string } {
  try {
    const { data, content } = matter(entry.content);
    const { html, headings } = renderMarkdown(content);
    const title = data.title?.split('|')[0]?.trim() || entry.slug.split('/').pop()?.replace(/-/g, ' ') || '';
    const description = data.description || '';
    return { title, description, headings, content: html };
  } catch {
    const { html, headings } = renderMarkdown(entry.content);
    const title = entry.slug.split('/').pop()?.replace(/-/g, ' ') || '';
    return { title, description: '', headings, content: html };
  }
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
  };
}

export function getSearchIndex(): SearchDoc[] {
  return docsCache.map(entry => {
    try {
      const { data, content } = matter(entry.content);
      const title = data.title?.split('|')[0]?.trim() || entry.slug.split('/').pop()?.replace(/-/g, ' ') || '';
      const { html } = renderMarkdown(content);
      const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const excerpt = text.slice(0, 160) + (text.length > 160 ? '…' : '');
      return {
        slug: entry.slug,
        lang: entry.lang,
        category: entry.category,
        title,
        description: data.description || '',
        excerpt,
      };
    } catch {
      return {
        slug: entry.slug,
        lang: entry.lang,
        category: entry.category,
        title: entry.slug.split('/').pop()?.replace(/-/g, ' ') || '',
        description: '',
        excerpt: '',
      };
    }
  });
}
