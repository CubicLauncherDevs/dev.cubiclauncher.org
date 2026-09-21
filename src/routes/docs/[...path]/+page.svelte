<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import Header from '$lib/components/global/Header.svelte';
  import Footer from '$lib/components/global/Footer.svelte';
  import Search from '$lib/components/docs/Search.svelte';
  import DocToc from '$lib/components/docs/DocToc.svelte';
  import ImageLightbox from '$lib/components/docs/ImageLightbox.svelte';
  import '../../../styles/docs.css';

  let { data } = $props();

  function defaultLang() {
    if (browser) {
      const stored = localStorage.getItem('docs-lang');
      if (stored && data.langs.some(l => l.code === stored)) return stored;
    }
    return data.lang || data.langs?.[0]?.code || 'es-ES';
  }

  let selectedLang = $state(defaultLang());

  $effect(() => {
    if (data.page === 'doc' && data.lang) selectedLang = data.lang;
  });

  let currentLang = $derived(data.langs.find(l => l.code === selectedLang) || data.langs[0]);

  let langParam = $derived(currentLang?.code ? `?lang=${currentLang.code}` : '');

  let pageTitle = $derived(
    data.page === 'doc' ? (data.wikiTitle || data.title)
    : data.page === 'todas' ? 'Todas las páginas'
    : data.page === 'categoria' ? `Categoría: ${data.categoryLabel || data.category}`
    : data.page === 'categorias' ? 'Categorías'
    : 'Portada'
  );

  function attachCopyListeners(node: HTMLElement) {
    function onClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest('.code-block-copy') as HTMLButtonElement | null;
      if (!btn) return;
      const code = btn.getAttribute('data-code');
      if (!code) return;
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
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
  let articleWrap: HTMLElement | undefined = $state();

  function collectImages() {
    if (!articleWrap) return;
    const buttons = [...articleWrap.querySelectorAll('.docs-lightbox-trigger')] as HTMLButtonElement[];
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
    collectImages();
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
        const el = document.querySelector(hash);
        if (el) {
          openParentDetails(el);
          el.scrollIntoView({ behavior: 'smooth' });
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

<Header />

<div class="docs-root">
  <div class="wiki-topbar">
    <div class="wiki-topbar-inner">
      <div class="wiki-topbar-search">
        <Search searchIndex={data.searchIndex} currentLang={currentLang?.code || 'es-ES'} />
      </div>
      <nav class="wiki-topbar-links" aria-label="Navegación wiki">
        <a href="/docs" class="wiki-topbar-link" class:active={data.page === 'index'}>Portada</a>
        <span class="wiki-topbar-sep" aria-hidden="true"></span>
        <a href="/docs/categoria{langParam}" class="wiki-topbar-link" class:active={data.page === 'categorias' || data.page === 'categoria'}>Categorías</a>
        <span class="wiki-topbar-sep" aria-hidden="true"></span>
        <a href="/docs/todas{langParam}" class="wiki-topbar-link" class:active={data.page === 'todas'}>Todas las páginas</a>
        <span class="wiki-topbar-sep" aria-hidden="true"></span>
        <a href="/docs/aleatoria{langParam}" class="wiki-topbar-link">Aleatoria</a>
      </nav>
      <div class="wiki-topbar-lang">
        <select
          class="wiki-lang-select"
          aria-label="Idioma"
          value={currentLang?.code}
          onchange={(e) => {
            const code = e.currentTarget.value;
            localStorage.setItem('docs-lang', code);
            selectedLang = code;
            if (data.page === 'categorias' || data.page === 'categoria') {
              window.location.href = `/docs/categoria?lang=${code}`;
            } else if (data.page === 'todas') {
              window.location.href = `/docs/todas?lang=${code}`;
            } else if (data.page === 'index') {
              window.location.reload();
            }
          }}
        >
          {#each data.langs as lang}
            <option value={lang.code}>{lang.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <main class="wiki-main">
    {#if data.page === 'index'}
      <div class="wiki-home">
        <div class="wiki-hero">
          <h1 class="wiki-title">CubicLauncher Docs</h1>
          <p class="wiki-tagline">La wiki comunitaria de CubicLauncher, el launcher de Minecraft multiplataforma y open source.</p>
          {#if data.categories}
            <div class="wiki-hero-stats">
              <span><strong>{data.pageCount}</strong> artículos</span>
              <span><strong>{data.categories.length}</strong> categorías</span>
            </div>
          {/if}
        </div>

        {#if data.categories}
          <div class="wiki-portals">
            {#each data.categories as cat}
              <a href="/docs/categoria/{encodeURIComponent(cat.name)}{langParam}" class="wiki-portal">
                <span class="wiki-portal-name">{cat.label || cat.name}</span>
                <span class="wiki-portal-count">{cat.count} {cat.count === 1 ? 'página' : 'páginas'}</span>
              </a>
            {/each}
          </div>
        {/if}

        {#if data.sections}
          {#each data.sections as section}
            <div class="wiki-home-section">
              <h2 class="wiki-home-section-title">{section.label}</h2>
              <ul class="wiki-home-list">
                {#each section.pages as p}
                  <li><a href="/docs/{p.slug}">{p.title}</a></li>
                {/each}
              </ul>
            </div>
          {/each}
        {/if}
      </div>
    {:else if data.page === 'categorias'}
      <article class="wiki-article">
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">Categorías</h1>
          <p class="wiki-page-subtitle">Todas las categorías de la wiki en {currentLang?.label}.</p>
        </header>
        <div class="wiki-cat-grid">
          {#each data.categories as cat}
            <a href="/docs/categoria/{encodeURIComponent(cat.name)}{langParam}" class="wiki-cat-card">
              <span class="wiki-cat-name">{cat.label || cat.name}</span>
              <span class="wiki-cat-count">{cat.count} {cat.count === 1 ? 'página' : 'páginas'}</span>
            </a>
          {/each}
        </div>
      </article>
    {:else if data.page === 'categoria'}
      <article class="wiki-article">
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">Categoría: {data.categoryLabel || data.category}</h1>
          <p class="wiki-page-subtitle">{data.pages.length} {data.pages.length === 1 ? 'página' : 'páginas'} en esta categoría.</p>
        </header>
        <ul class="wiki-page-list">
          {#each data.pages as p}
            <li><a href="/docs/{p.slug}">{p.title}</a></li>
          {/each}
        </ul>
      </article>
    {:else if data.page === 'todas'}
      <article class="wiki-article">
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">Todas las páginas</h1>
          <p class="wiki-page-subtitle">Índice alfabético de los {data.pages.length} artículos de la wiki en {currentLang?.label}.</p>
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
      <article class="wiki-article" bind:this={articleWrap}>
        <header class="wiki-page-header">
          <h1 class="wiki-page-title">{data.wikiTitle || data.title}</h1>
          <p class="wiki-page-subtitle">De CubicLauncher Docs</p>
          <div class="wiki-page-meta">
            <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel || data.category}</a>
            <span aria-hidden="true">·</span>
            <a href="{data.editBase}/{data.wikiCategory}.md" target="_blank" rel="noopener noreferrer">Editar</a>
            <span aria-hidden="true">·</span>
            <a href="https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/commits/main/src/docs/{data.slug}.md" target="_blank" rel="noopener noreferrer">Historial</a>
          </div>
        </header>

        <div class="wiki-article-body" use:attachCopyListeners use:attachLightbox>
          <DocToc headings={data.headings} />
          {@html data.html}
        </div>

        {#if data.category}
          <div class="wiki-catbox">
            <span class="wiki-catbox-label">Categoría</span>
            <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel || data.category}</a>
          </div>
        {/if}
      </article>
    {/if}
  </main>
</div>

<Footer />

<ImageLightbox images={images} bind:openIndex={lightboxOpenIndex} />
