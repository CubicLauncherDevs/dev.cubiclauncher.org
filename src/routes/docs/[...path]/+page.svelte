<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ThemeToggle from '$lib/components/docs/ThemeToggle.svelte';
  import Footer from '$lib/components/global/Footer.svelte';
  import Search from '$lib/components/docs/Search.svelte';
  import DocToc from '$lib/components/docs/DocToc.svelte';
  import ImageLightbox from '$lib/components/docs/ImageLightbox.svelte';
  import '../../../styles/docs.css';

  let { data } = $props();

  let menuOpen = $state(false);
  let currentLang = $derived(data.langs.find(l => l.code === data.lang) || data.langs[0]);
  let navigation = $derived(data.tree.find(l => l.code === currentLang?.code)?.children || []);
  let langParam = $derived(currentLang?.code ? `?lang=${currentLang.code}` : '');

  type UiStrings = {
    explore: string;
    home: string;
    categories: string;
    allPages: string;
    categoryTitle: (label: string) => string;
    docs: string;
    community: string;
    github: string;
    eyebrow: string;
    heroTitle: string;
    tagline: string;
    articleWord: (n: number) => string;
    categoryWord: (n: number) => string;
    pagesCount: (n: number) => string;
    categoriasSubtitle: (lang: string) => string;
    categoriaSubtitle: (n: number) => string;
    todasSubtitle: (n: number, lang: string) => string;
    quick: { label: string; description: string }[];
  };

  const UI: Record<string, UiStrings> = {
    'es-ES': {
      explore: 'Explorar la documentación',
      home: 'Portada',
      categories: 'Categorías',
      allPages: 'Todas las páginas',
      categoryTitle: (label) => `Categoría: ${label}`,
      docs: 'Documentación',
      community: 'Comunidad',
      github: 'Proyecto en GitHub ↗',
      eyebrow: 'Documentación de la comunidad',
      heroTitle: 'Documentación de CubicLauncher',
      tagline: 'Todo lo que necesitas para instalar, configurar y aprovechar tu launcher de Minecraft. Explora las guías o busca una respuesta concreta.',
      articleWord: (n) => (n === 1 ? 'artículo' : 'artículos'),
      categoryWord: (n) => (n === 1 ? 'categoría' : 'categorías'),
      pagesCount: (n) => `${n} ${n === 1 ? 'página' : 'páginas'}`,
      categoriasSubtitle: (lang) => `Todas las categorías de la documentación en ${lang}.`,
      categoriaSubtitle: (n) => `${n} ${n === 1 ? 'página' : 'páginas'} en esta categoría.`,
      todasSubtitle: (n, lang) => `Índice alfabético de los ${n} ${n === 1 ? 'artículo' : 'artículos'} de la documentación en ${lang}.`,
      quick: [
        { label: 'Conoce el launcher', description: 'Características y primeros pasos.' },
        { label: 'Instala CubicLauncher', description: 'Prepara el launcher en tu sistema.' },
        { label: 'Encuentra ayuda', description: 'Resuelve dudas y problemas habituales.' }
      ]
    },
    'en-EN': {
      explore: 'Explore the documentation',
      home: 'Home',
      categories: 'Categories',
      allPages: 'All pages',
      categoryTitle: (label) => `Category: ${label}`,
      docs: 'Documentation',
      community: 'Community',
      github: 'Project on GitHub ↗',
      eyebrow: 'Community documentation',
      heroTitle: 'CubicLauncher documentation',
      tagline: 'Everything you need to install, configure and get the most out of your Minecraft launcher. Browse the guides or search for a specific answer.',
      articleWord: (n) => (n === 1 ? 'article' : 'articles'),
      categoryWord: (n) => (n === 1 ? 'category' : 'categories'),
      pagesCount: (n) => `${n} ${n === 1 ? 'page' : 'pages'}`,
      categoriasSubtitle: (lang) => `All documentation categories in ${lang}.`,
      categoriaSubtitle: (n) => `${n} ${n === 1 ? 'page' : 'pages'} in this category.`,
      todasSubtitle: (n, lang) => `Alphabetical index of the ${n} ${n === 1 ? 'article' : 'articles'} in the documentation in ${lang}.`,
      quick: [
        { label: 'Meet the launcher', description: 'Features and first steps.' },
        { label: 'Install CubicLauncher', description: 'Set up the launcher on your system.' },
        { label: 'Find help', description: 'Solve common questions and issues.' }
      ]
    },
    'fr-FR': {
      explore: 'Explorer la documentation',
      home: 'Accueil',
      categories: 'Catégories',
      allPages: 'Toutes les pages',
      categoryTitle: (label) => `Catégorie : ${label}`,
      docs: 'Documentation',
      community: 'Communauté',
      github: 'Projet sur GitHub ↗',
      eyebrow: 'Documentation communautaire',
      heroTitle: 'Documentation de CubicLauncher',
      tagline: 'Tout ce qu\'il faut pour installer, configurer et profiter de votre launcher Minecraft. Parcourez les guides ou recherchez une réponse précise.',
      articleWord: (n) => (n === 1 ? 'article' : 'articles'),
      categoryWord: (n) => (n === 1 ? 'catégorie' : 'catégories'),
      pagesCount: (n) => `${n} ${n === 1 ? 'page' : 'pages'}`,
      categoriasSubtitle: (lang) => `Toutes les catégories de la documentation en ${lang}.`,
      categoriaSubtitle: (n) => `${n} ${n === 1 ? 'page' : 'pages'} dans cette catégorie.`,
      todasSubtitle: (n, lang) => `Index alphabétique des ${n} ${n === 1 ? 'article' : 'articles'} de la documentation en ${lang}.`,
      quick: [
        { label: 'Découvrir le launcher', description: 'Fonctionnalités et premiers pas.' },
        { label: 'Installer CubicLauncher', description: 'Préparez le launcher sur votre système.' },
        { label: 'Trouver de l\'aide', description: 'Résolvez les questions et problèmes courants.' }
      ]
    }
  };

  let ui = $derived(UI[currentLang?.code || 'es-ES'] || UI['es-ES']);

  const QUICK_MATCHES = [/\/(introduccion|introduction)$/, /\/(instalacion|install)$/, /\/(soporte|support)$/];
  let quickLinks = $derived(QUICK_MATCHES.map((match, i) => ({
    ...ui.quick[i],
    doc: data.searchIndex.find(d => d.lang === data.lang && match.test(d.slug))
  })));

  afterNavigate(() => {
    menuOpen = false;
    lightboxOpenIndex = -1;
  });

  function changeLanguage(code: string) {
    document.cookie = `docs-lang=${encodeURIComponent(code)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const destination = data.page === 'todas' ? '/docs/todas'
      : data.page === 'categoria' && !data.legacyNotice ? `/docs/categoria/${data.category}`
      : data.page === 'categoria' || data.page === 'categorias' ? '/docs/categoria' : '/docs';
    goto(`${destination}?lang=${encodeURIComponent(code)}`);
  }

  let pageTitle = $derived(
    data.page === 'doc' ? (data.wikiTitle || data.title)
    : data.page === 'todas' ? ui.allPages
    : data.page === 'categoria' ? ui.categoryTitle(data.categoryLabel || data.category)
    : data.page === 'categorias' ? ui.categories
    : ui.home
  );

  function attachCopyListeners(node: HTMLElement) {
    function onClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('.code-block-copy') as HTMLButtonElement | null;
      if (!btn) return;
      const code = btn.getAttribute('data-code');
      if (!code) return;
      navigator.clipboard?.writeText(code).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      }).catch(() => {
        btn.title = 'No se pudo copiar. Selecciona el código para copiarlo manualmente.';
      });
    }
    node.addEventListener('click', onClick);
    return {
      destroy() {
        node.removeEventListener('click', onClick);
      }
    };
  }

  let images = $state<{ src: string; alt: string }[]>([]);
  let lightboxOpenIndex = $state(-1);
  function collectImages(node: HTMLElement) {
    const buttons = [...node.querySelectorAll('.docs-lightbox-trigger')] as HTMLButtonElement[];
    images = buttons.map(btn => ({
      src: btn.getAttribute('data-src') || '',
      alt: btn.getAttribute('data-alt') || ''
    }));
  }

  function onArticleClick(e: MouseEvent) {
    const trigger = (e.target as HTMLElement).closest('.docs-lightbox-trigger') as HTMLButtonElement | null;
    if (!trigger) return;
    const src = trigger.getAttribute('data-src') || '';
    const index = images.findIndex(img => img.src === src);
    if (index !== -1) lightboxOpenIndex = index;
  }

  function attachLightbox(node: HTMLElement) {
    collectImages(node);
    node.addEventListener('click', onArticleClick);
    return {
      destroy() {
        node.removeEventListener('click', onArticleClick);
      }
    };
  }

  function openParentDetails(el: Element) {
    let node: HTMLElement | null = el.parentElement;
    while (node) {
      if (node.tagName === 'DETAILS') {
        (node as HTMLDetailsElement).open = true;
      }
      node = node.parentElement;
    }
  }

  $effect(() => {
    if (browser && data.page === 'doc') {
      const hash = $page.url.hash;
      if (hash) {
        let id = hash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* Conserva los fragmentos sin codificar. */ }
        const el = document.getElementById(id);
        if (el) {
          openParentDetails(el);
          el.scrollIntoView();
        }
      }
    }
  });
</script>

<svelte:head>
  <title>{pageTitle} — CubicLauncher Docs</title>
  {#if data.page === 'doc'}
    <meta name="description" content={data.description || `Documentación de CubicLauncher: ${data.title}.`} />
    <meta property="og:title" content="{pageTitle} — CubicLauncher Docs" />
    <meta property="og:description" content={data.description || `Documentación de CubicLauncher: ${data.title}.`} />
  {:else}
    <meta name="description" content="CubicLauncher Docs — Guías, referencias y recursos sobre CubicLauncher, el launcher de Minecraft multiplataforma." />
    <meta property="og:title" content="{pageTitle} — CubicLauncher Docs" />
    <meta property="og:description" content="Guías, referencias y recursos sobre CubicLauncher." />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/favicon.png" />
</svelte:head>

<div class="docs-root">
  <a class="wiki-skip-link" href="#wiki-content">Saltar al contenido</a>
  <header class="wiki-topbar">
    <div class="wiki-topbar-inner">
      <a class="wiki-brand" href="/docs{langParam}">
        <img src="/favicon.png" alt="" width="28" height="28" />
        <span>CubicLauncher<span class="wiki-brand-label">Docs</span></span>
      </a>
      <button class="wiki-menu-toggle" type="button" aria-label="Menú de documentación" aria-expanded={menuOpen} aria-controls="wiki-navigation" onclick={() => menuOpen = !menuOpen}><span aria-hidden="true">☰</span> <span class="wiki-menu-label">Menú</span></button>
      <div class="wiki-topbar-search">
        <Search searchIndex={data.searchIndex} currentLang={currentLang?.code || 'es-ES'} />
      </div>
      <div class="wiki-topbar-lang">
        <select
          class="wiki-lang-select"
          aria-label="Idioma"
          value={currentLang?.code}
          onchange={(e) => changeLanguage(e.currentTarget.value)}
        >
          {#each data.langs as lang}
            <option value={lang.code}>{lang.label}</option>
          {/each}
        </select>
      </div>
      <ThemeToggle />
    </div>
  </header>

  <div class="wiki-shell">
    <aside id="wiki-navigation" class="wiki-sidebar" class:wiki-sidebar-open={menuOpen}>
      <nav aria-label="Navegación de la documentación">
        <p class="wiki-nav-label">{ui.explore}</p>
        <a class="wiki-nav-link" href="/docs{langParam}" aria-current={data.page === 'index' ? 'page' : undefined}>{ui.home}</a>
        <a class="wiki-nav-link" href="/docs/categoria{langParam}" aria-current={data.page === 'categorias' ? 'page' : undefined}>{ui.categories}</a>
        <a class="wiki-nav-link" href="/docs/todas{langParam}" aria-current={data.page === 'todas' ? 'page' : undefined}>{ui.allPages}</a>
        <p class="wiki-nav-label">{ui.docs}</p>
        {#each navigation as category, i}
          <details class="wiki-nav-group" open={category.children?.some(p => p.slug === data.slug) || (data.page === 'categoria' && category.category === data.category) || (data.page === 'index' && i === 0)}>
            <summary title={category.description}>{category.label}</summary>
            {#each category.children || [] as doc}
              <a class="wiki-nav-link" href="/docs/{doc.slug}" aria-current={data.slug === doc.slug ? 'page' : undefined}>{doc.label}</a>
            {/each}
          </details>
        {/each}
        <p class="wiki-nav-label">{ui.community}</p>
        <a class="wiki-nav-link" href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer">{ui.github}</a>
        <a class="wiki-nav-link" href="https://discord.gg/7VaqSrPukm" target="_blank" rel="noopener noreferrer">Discord ↗</a>
      </nav>
    </aside>
  <main class="wiki-main" id="wiki-content" tabindex="-1">
    <nav class="wiki-breadcrumbs" aria-label="Ruta de navegación">
      <a href="/docs{langParam}">Docs</a>
      <span aria-hidden="true">/</span>
      {#if data.page === 'doc'}
        <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel}</a>
        <span aria-hidden="true">/</span>
      {/if}
      <span aria-current="page">{pageTitle}</span>
    </nav>
    {#if data.page === 'index'}
      <div class="wiki-home">
        <div class="wiki-hero">
          <p class="wiki-eyebrow">{ui.eyebrow}</p>
          <h1 class="wiki-title">{ui.heroTitle}</h1>
          <p class="wiki-tagline">{ui.tagline}</p>
          {#if data.categories}
            <div class="wiki-hero-stats">
              <span><strong>{data.pageCount}</strong> {ui.articleWord(data.pageCount)}</span>
              <span><strong>{data.categories.length}</strong> {ui.categoryWord(data.categories.length)}</span>
            </div>
          {/if}
        </div>

        <div class="wiki-quick-links" aria-label="Primeros pasos">
          {#each quickLinks as link, i}
            {#if link.doc}
              <a href="/docs/{link.doc.slug}" class="wiki-quick-link">
                <span class="wiki-quick-number">0{i + 1}</span>
                <strong>{link.label} <span aria-hidden="true">→</span></strong>
                <span>{link.description}</span>
              </a>
            {/if}
          {/each}
        </div>

        {#if data.categories}
          <div class="wiki-portals">
            {#each data.categories as cat}
              <a href="/docs/categoria/{encodeURIComponent(cat.name)}{langParam}" class="wiki-portal">
                <span class="wiki-portal-name">{cat.label || cat.name}</span>
                <span class="wiki-portal-count">{ui.pagesCount(cat.count)}</span>
              </a>
            {/each}
          </div>
        {/if}

        {#if data.sections}
          <div class="wiki-home-sections">
          {#each data.sections as section}
            <div class="wiki-home-section">
              <h2 class="wiki-home-section-title"><a href="/docs/categoria/{section.name}{langParam}">{section.label}</a></h2>
              <p class="wiki-category-description">{section.description}</p>
              <ul class="wiki-home-list">
                {#each section.pages as p}
                  <li><a href="/docs/{p.slug}">{p.title}</a>{#if p.description}<p>{p.description}</p>{/if}</li>
                {/each}
              </ul>
            </div>
          {/each}
          </div>
        {/if}
      </div>
    {:else if data.page === 'categorias'}
      <article class="wiki-article">
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">{ui.categories}</h1>
          <p class="wiki-page-subtitle">{ui.categoriasSubtitle(currentLang?.label || '')}</p>
        </header>
        <div class="wiki-cat-grid">
          {#each data.categories as cat}
            <a href="/docs/categoria/{encodeURIComponent(cat.name)}{langParam}" class="wiki-cat-card">
              <span class="wiki-cat-name">{cat.label || cat.name}</span>
              <span class="wiki-category-description">{cat.description}</span>
              <span class="wiki-cat-count">{ui.pagesCount(cat.count)}</span>
            </a>
          {/each}
        </div>
      </article>
    {:else if data.page === 'categoria'}
      <article class="wiki-article">
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">{ui.categoryTitle(data.categoryLabel || data.category)}</h1>
          {#if data.categoryDescription}<p class="wiki-category-description">{data.categoryDescription}</p>{/if}
          <p class="wiki-page-subtitle">{ui.categoriaSubtitle(data.pages.length)}</p>
        </header>
        {#if data.legacyNotice}
          <div class="wiki-category-transition">
            <p>{data.legacyNotice}</p>
            <div class="wiki-portals">
              {#each data.successorCategories as cat}
                <a class="wiki-portal" href="/docs/categoria/{cat.name}{langParam}">{cat.label}</a>
              {/each}
            </div>
          </div>
        {/if}
        <ul class="wiki-page-list">
          {#each data.pages as p}
            <li>
              <a href="/docs/{p.slug}">{p.title}</a>
              {#if data.legacyNotice}
                <span class="wiki-page-list-cat"> — <a href="/docs/categoria/{p.category}{langParam}">{p.categoryLabel}</a></span>
              {/if}
              {#if p.description}<p class="wiki-category-description">{p.description}</p>{/if}
            </li>
          {/each}
        </ul>
      </article>
    {:else if data.page === 'todas'}
      <article class="wiki-article">
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">{ui.allPages}</h1>
          <p class="wiki-page-subtitle">{ui.todasSubtitle(data.pages.length, currentLang?.label || '')}</p>
        </header>
        <ul class="wiki-page-list">
          {#each data.pages as p}
            <li>
              <a href="/docs/{p.slug}">{p.title}</a>
              <span class="wiki-page-list-cat"> — {p.categoryLabel || p.category}</span>
            </li>
          {/each}
        </ul>
      </article>
    {:else}
      <article class="wiki-article wiki-document" lang={data.lang.split('-')[0]}>
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">{data.wikiTitle || data.title}</h1>
          <p class="wiki-page-subtitle">{data.description || 'De CubicLauncher Docs'}</p>
          <div class="wiki-page-meta">
            <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel || data.category}</a>
            <span aria-hidden="true">·</span>
            <a href="{data.editBase}/{data.wikiCategory}.md" target="_blank" rel="noopener noreferrer">Editar</a>
            <span aria-hidden="true">·</span>
            <a href="https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/commits/main/src/docs/{data.slug}.md" target="_blank" rel="noopener noreferrer">Historial</a>
          </div>
        </header>

        {#key data.slug}
          <aside class="wiki-contents">
            <DocToc headings={data.headings} />
          </aside>
          <div class="wiki-article-body" use:attachCopyListeners use:attachLightbox>
            {@html data.html}
          </div>
        {/key}

        {#if data.category}
          <div class="wiki-catbox">
            <span class="wiki-catbox-label">Categoría</span>
            <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel || data.category}</a>
            <a class="wiki-back-top" href="#wiki-content">Volver arriba ↑</a>
          </div>
        {/if}
      </article>
    {/if}
  </main>
    <Footer docsHref={`/docs${langParam}`} />
  </div>
</div>

<ImageLightbox images={images} bind:openIndex={lightboxOpenIndex} />
