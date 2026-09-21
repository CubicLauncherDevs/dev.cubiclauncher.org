import { error, redirect } from '@sveltejs/kit';
import { getDoc, getDocTree, getSearchIndex, getAllPages, getRandomPageSlug, catDisplay } from '$lib/server/docs';
import type { SearchDoc } from '$lib/server/docs';

const CATEGORY_ALIASES = ['categoria', 'categorias', 'categories'];
const ALL_ALIASES = ['todas', 'todas-las-paginas', 'allpages', 'all-pages', 'all'];
const RANDOM_ALIASES = ['aleatoria', 'aleatorio', 'random'];

function resolveLang(langs: { code: string }[], value: string | null): string {
  if (value && langs.some(l => l.code === value)) return value;
  return langs[0]?.code || 'es-ES';
}

/** Compara nombres de categoría ignorando mayúsculas, guiones y guiones bajos */
function normCat(s: string): string {
  return s.toLowerCase().replace(/[_-]+/g, ' ').trim();
}

export function load({ params, url }) {
  const path = params.path || '';
  const tree = getDocTree();
  const langs: { code: string; label: string }[] = tree.map(l => ({ code: l.code!, label: l.label }));
  const searchIndex: SearchDoc[] = getSearchIndex();

  if (!path) {
    const lang = resolveLang(langs, url.searchParams.get('lang'));
    const all = getAllPages(lang);
    const categories = [...new Set(all.map(p => p.category))].map(name => ({
      name,
      label: catDisplay(name),
      count: all.filter(p => p.category === name).length,
    }));
    // Portada estilo wiki: una lista de páginas por categoría
    const sections = categories.map(cat => ({
      label: catDisplay(cat.name),
      pages: all.filter(p => p.category === cat.name),
    }));
    return { page: 'index' as const, tree, langs, searchIndex, lang, categories, sections, pageCount: all.length };
  }

  const parts = path.split('/');
  const first = parts[0];
  const lang = resolveLang(langs, url.searchParams.get('lang'));

  // /docs/categoria[/<categoría>]
  if (CATEGORY_ALIASES.includes(first)) {
    const all = getAllPages(lang);
    const categories = [...new Set(all.map(p => p.category))].map(name => ({
      name,
      label: catDisplay(name),
      count: all.filter(p => p.category === name).length,
    }));
    if (parts.length < 2 || !parts[1]) {
      return { page: 'categorias' as const, tree, langs, searchIndex, lang, categories };
    }
    const wanted = decodeURIComponent(parts.slice(1).join('/'));
    const match = categories.find(c => normCat(c.name) === normCat(wanted));
    if (!match) redirect(307, `/docs/categoria?lang=${lang}`);
    const pages = all.filter(p => p.category === match.name);
    return {
      page: 'categoria' as const,
      tree, langs, searchIndex, lang,
      category: match.name,
      categoryLabel: match.label,
      categories,
      pages,
    };
  }

  // /docs/todas — índice alfabético
  if (ALL_ALIASES.includes(first)) {
    return { page: 'todas' as const, tree, langs, searchIndex, lang, pages: getAllPages(lang) };
  }

  // /docs/aleatoria — página aleatoria
  if (RANDOM_ALIASES.includes(first)) {
    redirect(307, `/docs/${getRandomPageSlug(lang)}`);
  }

  const doc = getDoc(path);
  if (!doc) error(404, 'Documento no encontrado');

  // Estilo wiki: el título vive en la cabecera de la página, no dentro del contenido
  const html = doc.content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');

  return {
    page: 'doc' as const,
    title: doc.title,
    description: doc.description,
    html,
    headings: doc.headings.filter(h => h.level > 1),
    slug: path,
    lang: doc.lang,
    category: doc.category,
    categoryLabel: catDisplay(doc.category),
    wikiTitle: doc.wikiTitle,
    wikiCategory: doc.wikiCategory,
    editBase: doc.editBase,
    tree,
    langs,
    searchIndex,
  };
}
