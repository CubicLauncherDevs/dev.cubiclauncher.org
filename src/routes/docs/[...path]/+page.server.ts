import { error } from '@sveltejs/kit';
import { getDoc, getDocTree } from '$lib/server/docs';
import { marked } from 'marked';
import matter from 'gray-matter';

export function load({ params }) {
  const path = params.path || '';
  const tree = getDocTree();
  const langs: { code: string; label: string }[] = tree.map(l => ({ code: l.code!, label: l.label }));

  if (!path) {
    return { tree, langs, page: 'index' as const };
  }

  const doc = getDoc(path);
  if (!doc) error(404, 'Documento no encontrado');

  const { data, content } = matter(doc.content);
  const html = marked.parse(content, { async: false }) as string;
  const title = data.title || path.split('/').pop() || '';

  return {
    page: 'doc' as const,
    title,
    html,
    slug: path,
    lang: doc.lang,
    tree,
    langs,
  };
}
