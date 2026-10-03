import { error, redirect } from '@sveltejs/kit';
import { getDoc, getDocTree, getSearchIndex, getAllPages, getCategories, getCategoryPages, getRandomPageSlug, catDisplay } from '$lib/server/docs';
import type { SearchDoc } from '$lib/server/docs';

const CATEGORY_ALIASES = ['categoria', 'categorias', 'categories'];
const ALL_ALIASES = ['todas', 'todas-las-paginas', 'allpages', 'all-pages', 'all'];
const RANDOM_ALIASES = ['aleatoria', 'aleatorio', 'random'];

function resolveLang(langs: { code: string }[], value: string | null): string {
  if (value && langs.some(l => l.code === value)) return value;
  return langs[0]?.code || 'es-ES';
}

/** Permite buscar por identificador o nombre traducido. */
function normCat(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_-]+/g, ' ').trim();
}

export function load({ params, url, cookies }) {
  const path = params.path || '';
  const tree = getDocTree();
  const langs: { code: string; label: string }[] = tree.map(l => ({ code: l.code!, label: l.label }));
  const searchIndex: SearchDoc[] = getSearchIndex();
  const preferredLang = url.searchParams.get('lang') || cookies.get('docs-lang') || null;
  const lang = resolveLang(langs, preferredLang);
  const categories = getCategories(lang);

  if (!path) {
    // La portada comparte el orden editorial con la navegación y las categorías.
    const sections = categories.map(cat => ({
      ...cat,
      pages: getCategoryPages(cat.name, lang),
    }));
    return { page: 'index' as const, tree, langs, searchIndex, lang, categories, sections, pageCount: categories.reduce((total, cat) => total + cat.count, 0) };
  }

  const parts = path.split('/');
  const first = parts[0];

  // /docs/categoria[/<categoría>]
  if (CATEGORY_ALIASES.includes(first)) {
    if (parts.length < 2 || !parts[1]) {
      return { page: 'categorias' as const, tree, langs, searchIndex, lang, categories };
    }
    const wanted = normCat(parts.slice(1).join('/'));
    const match = categories.find(c => normCat(c.name) === wanted || normCat(c.label) === wanted);
    if (match) {
      return {
        page: 'categoria' as const,
        tree, langs, searchIndex, lang,
        category: match.name,
        categoryLabel: match.label,
        categoryDescription: match.description,
        legacyNotice: null,
        successorCategories: [],
        categories,
        pages: getCategoryPages(match.name, lang),
      };
    }

    // Las carpetas antiguas siguen resolviendo sus enlaces públicos.
    const all = getAllPages(lang);
    const legacyName = all.map(p => p.slug.split('/')[1]).find(name =>
      normCat(name) === wanted || normCat(catDisplay(name, lang)) === wanted);
    if (!legacyName) redirect(307, `/docs/categoria?lang=${lang}`);
    const pages = all.filter(p => p.slug.split('/')[1] === legacyName);
    const successorCategories = categories.filter(c => pages.some(p => p.category === c.name));
    if (successorCategories.length === 1) {
      redirect(308, `/docs/categoria/${successorCategories[0].name}?lang=${lang}`);
    }
    const notices: Record<string, string> = {
      'es-ES': 'Esta categoría se reorganizó por temas. Explora las categorías actuales o accede a sus artículos desde la lista inferior.',
      'en-EN': 'This category was reorganized by topic. Explore the current categories or find its articles in the list below.',
      'fr-FR': 'Cette catégorie a été réorganisée par thème. Explorez les catégories actuelles ou retrouvez ses articles dans la liste ci-dessous.'
    };
    return {
      page: 'categoria' as const,
      tree, langs, searchIndex, lang,
      category: legacyName,
      categoryLabel: catDisplay(legacyName, lang),
      categoryDescription: '',
      legacyNotice: notices[lang],
      successorCategories,
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
    categoryLabel: catDisplay(doc.category, doc.lang),
    wikiTitle: doc.wikiTitle,
    wikiCategory: doc.wikiCategory,
    editBase: doc.editBase,
    tree,
    langs,
    searchIndex,
  };
}
