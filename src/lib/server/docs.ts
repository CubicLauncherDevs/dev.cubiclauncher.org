import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDir = path.resolve('src/docs');

export interface DocNode {
  label: string;
  slug?: string;
  children?: DocNode[];
  code?: string;
}

export interface DocMeta {
  title: string;
  lang: string;
  category: string;
  slug: string;
  content: string;
}

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
  const langs = fs.readdirSync(docsDir, { withFileTypes: true }).filter(d => d.isDirectory());
  const tree: DocNode[] = [];

  for (const lang of langs) {
    const langNode: DocNode = { label: langName(lang.name), code: lang.name, children: [] };
    const categories = fs.readdirSync(path.join(docsDir, lang.name), { withFileTypes: true }).filter(d => d.isDirectory());
    const catOrder = ['Comenzando', 'Getting-Started', 'Pour-commencer', 'Uso', 'Usage', 'Utilisation', 'Avanzado', 'Advanced', 'Avance', 'guias', 'guides', 'Legal'];
    categories.sort((a, b) => {
      const pa = catOrder.indexOf(a.name);
      const pb = catOrder.indexOf(b.name);
      return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    });
    for (const cat of categories) {
      const catNode: DocNode = { label: catDisplay(cat.name), children: [] };
      const files = fs.readdirSync(path.join(docsDir, lang.name, cat.name)).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(docsDir, lang.name, cat.name, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        let title = slug.replace(/-/g, ' ');
        try {
          const { data } = matter(raw);
          if (data.title) title = data.title.split('|')[0].trim();
        } catch {}
        catNode.children!.push({ label: title, slug: `${lang.name}/${cat.name}/${slug}` });
      }
      catNode.children?.sort((a, b) => a.label.localeCompare(b.label));
      langNode.children!.push(catNode);
    }
    tree.push(langNode);
  }
  return tree;
}

export function getDoc(slug: string): DocMeta | null {
  const filePath = path.join(docsDir, slug + '.md');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parts = slug.split('/');
  const lang = parts[0];
  const category = parts[1];
  return { lang, category, slug, title: '', content: raw };
}
