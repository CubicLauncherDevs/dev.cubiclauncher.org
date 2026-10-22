<script lang="ts">
  import { browser } from '$app/environment';
  import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ThemeToggle from '$lib/components/docs/ThemeToggle.svelte';
  import Footer from '$lib/components/global/Footer.svelte';
  import Search from '$lib/components/docs/Search.svelte';
  import DocToc from '$lib/components/docs/DocToc.svelte';
  import ImageLightbox from '$lib/components/docs/ImageLightbox.svelte';
  import Contributors from '$lib/components/docs/Contributors.svelte';
  import { docsUi } from '$lib/docs/i18n';
  import '../../../styles/docs.css';

  let { data } = $props();

  let menuOpen = $state(false);
  let currentLang = $derived(data.langs.find(l => l.code === data.lang) || data.langs[0]);
  let navigation = $derived(data.tree.find(l => l.code === currentLang?.code)?.children || []);
  let langParam = $derived(currentLang?.code ? `?lang=${currentLang.code}` : '');

  let ui = $derived(docsUi(currentLang?.code));

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
        btn.title = ui.chrome.copyFailed;
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
  <title>{ui.meta.docsTitle(pageTitle)}</title>
  {#if data.page === 'doc'}
    <meta name="description" content={data.description || ui.meta.docDescription(data.title)} />
    <meta property="og:title" content={ui.meta.docsTitle(pageTitle)} />
    <meta property="og:description" content={data.description || ui.meta.docDescription(data.title)} />
  {:else}
    <meta name="description" content={ui.meta.indexDescription} />
    <meta property="og:title" content={ui.meta.docsTitle(pageTitle)} />
    <meta property="og:description" content={ui.meta.indexOgDescription} />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/favicon.png" />
</svelte:head>

<div class="docs-root">
  <a class="wiki-skip-link" href="#wiki-content">{ui.chrome.skipToContent}</a>
  <header class="wiki-topbar">
    <div class="wiki-topbar-inner">
      <a class="wiki-brand" href="/docs{langParam}">
        <img src="/favicon.png" alt="" width="28" height="28" />
        <span>CubicLauncher<span class="wiki-brand-label">Docs</span></span>
      </a>
      <button class="wiki-menu-toggle" type="button" aria-label={ui.chrome.menuLabel} aria-expanded={menuOpen} aria-controls="wiki-navigation" onclick={() => menuOpen = !menuOpen}><span aria-hidden="true">☰</span> <span class="wiki-menu-label">{ui.chrome.menu}</span></button>
      <div class="wiki-topbar-search">
        <Search searchIndex={data.searchIndex} currentLang={currentLang?.code || 'es-ES'} labels={ui.search} />
      </div>
      <div class="wiki-topbar-lang">
        <select
          class="wiki-lang-select"
          aria-label={ui.chrome.language}
          value={currentLang?.code}
          onchange={(e) => changeLanguage(e.currentTarget.value)}
        >
          {#each data.langs as lang}
            <option value={lang.code}>{lang.label}</option>
          {/each}
        </select>
      </div>
      <ThemeToggle labels={ui.theme} />
    </div>
  </header>

  <div class="wiki-shell">
    <aside id="wiki-navigation" class="wiki-sidebar" class:wiki-sidebar-open={menuOpen}>
      <nav aria-label={ui.chrome.navLabel}>
        <p class="wiki-nav-label">{ui.explore}</p>
        <a class="wiki-nav-link" href="/docs{langParam}" aria-current={data.page === 'index' ? 'page' : undefined}>{ui.home}</a>
        <a class="wiki-nav-link" href="/docs/categoria{langParam}" aria-current={data.page === 'categorias' ? 'page' : undefined}>{ui.categories}</a>
        <a class="wiki-nav-link" href="/docs/todas{langParam}" aria-current={data.page === 'todas' ? 'page' : undefined}>{ui.allPages}</a>
        <p class="wiki-nav-label">{ui.docs}</p>
        {#each navigation as category, i}
          <details class="wiki-nav-group" open={category.children?.some(p => p.slug === data.slug) || (data.page === 'categoria' && category.category === data.category) || (data.page === 'index' && i === 0)}>
            <summary title={category.description}>
              <span>{category.label}</span>
              <svg class="wiki-nav-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </summary>
            {#each category.children || [] as doc}
              <a class="wiki-nav-link" href="/docs/{doc.slug}" aria-current={data.slug === doc.slug ? 'page' : undefined}>{doc.label}</a>
            {/each}
          </details>
        {/each}
        <p class="wiki-nav-label">{ui.community}</p>
        <div class="wiki-community">
          <a class="wiki-community-link" href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer">
            <span class="wiki-community-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </span>
            <span class="wiki-community-name">{ui.github}</span>
            <svg class="wiki-community-external" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
          <a class="wiki-community-link" href="https://discord.gg/7VaqSrPukm" target="_blank" rel="noopener noreferrer">
            <span class="wiki-community-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419Z" />
              </svg>
            </span>
            <span class="wiki-community-name">{ui.discord}</span>
            <svg class="wiki-community-external" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </div>
      </nav>
    </aside>
  <main class="wiki-main" id="wiki-content" tabindex="-1">
    <nav class="wiki-breadcrumbs" aria-label={ui.chrome.breadcrumbLabel}>
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

        <div class="wiki-quick-links" aria-label={ui.chrome.quickLinksLabel}>
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

        {#if data.contributors?.length}
          <Contributors
            contributors={data.contributors}
            title={ui.contributors}
            subtitle={ui.contributorsSubtitle}
            contributionLabel={ui.contributionCount}
          />
        {/if}

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
          <p class="wiki-page-subtitle">{data.description || ui.meta.docFallbackSubtitle}</p>
          <div class="wiki-page-meta">
            <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel || data.category}</a>
            <span aria-hidden="true">·</span>
            <a href="{data.editBase}/{data.wikiCategory}.md" target="_blank" rel="noopener noreferrer">{ui.chrome.edit}</a>
            <span aria-hidden="true">·</span>
            <a href="https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/commits/main/src/docs/{data.slug}.md" target="_blank" rel="noopener noreferrer">{ui.chrome.history}</a>
          </div>
        </header>

        {#key data.slug}
          <aside class="wiki-contents">
            <DocToc headings={data.headings} labels={ui.toc} />
          </aside>
          <div class="wiki-article-body" use:attachCopyListeners use:attachLightbox>
            {@html data.html}
          </div>
        {/key}

        {#if data.category}
          <div class="wiki-catbox">
            <span class="wiki-catbox-label">{ui.chrome.category}</span>
            <a href="/docs/categoria/{encodeURIComponent(data.category)}{langParam}">{data.categoryLabel || data.category}</a>
            <a class="wiki-back-top" href="#wiki-content">{ui.chrome.backToTop}</a>
          </div>
        {/if}
      </article>
    {/if}
  </main>
    <Footer docsHref={`/docs${langParam}`} />
  </div>
</div>

<ImageLightbox images={images} bind:openIndex={lightboxOpenIndex} labels={ui.lightbox} />
