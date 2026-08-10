import { error } from '@sveltejs/kit';
import { getDoc, getDocTree, getSearchIndex } from '$lib/server/docs';
import type { SearchDoc } from '$lib/server/docs';

export function load({ params }) {
  const path = params.path || '';
  const tree = getDocTree();
  const langs: { code: string; label: string }[] = tree.map(l => ({ code: l.code!, label: l.label }));
  const searchIndex: SearchDoc[] = getSearchIndex();

  if (!path) {
    return { tree, langs, searchIndex, page: 'index' as const };
  }

  const doc = getDoc(path);
  if (!doc) error(404, 'Documento no encontrado');

  return {
    page: 'doc' as const,
    title: doc.title,
    description: doc.description,
    html: doc.content,
    headings: doc.headings,
    slug: path,
    lang: doc.lang,
    category: doc.category,
    tree,
    langs,
    searchIndex,
  };
}
