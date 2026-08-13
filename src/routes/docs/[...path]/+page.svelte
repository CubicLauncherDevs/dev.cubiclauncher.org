<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Header from '$lib/components/global/Header.svelte';
  import Footer from '$lib/components/global/Footer.svelte';
  import Search from '$lib/components/docs/Search.svelte';
  import DocToc from '$lib/components/docs/DocToc.svelte';
  import ImageLightbox from '$lib/components/docs/ImageLightbox.svelte';
  import '../../../styles/docs.css';

  let { data } = $props();

  function defaultLang() {
    if (data.page !== 'doc') {
      if (browser) {
        const stored = localStorage.getItem('docs-lang');
        if (stored && data.langs.some(l => l.code === stored)) return stored;
      }
      return 'es-ES';
    }
    return data.lang;
  }

  let selectedLang = $state(defaultLang());
  let sidebarOpen = $state(false);
  let langOpen = $state(false);
  let collapsed = $state<Record<string, boolean>>({});
  let langBtn: HTMLButtonElement;
  let langMenuStyle = $state('');
  let articleWrap: HTMLElement | undefined = $state();

  $effect(() => {
    selectedLang = defaultLang();
  });

  let currentLang = $derived(data.langs.find(l => l.code === selectedLang) || data.langs[0]);
  let langTree = $derived(data.tree.find(l => l.code === currentLang?.code));

  let flatItems = $derived(
    langTree?.children?.flatMap(cat => cat.children?.map(item => ({ ...item, category: cat.label })) || []) || []
  );

  let currentIndex = $derived(data.page === 'doc' ? flatItems.findIndex(i => i.slug === data.slug) : -1);
  let prevItem = $derived(currentIndex > 0 ? flatItems[currentIndex - 1] : undefined);
  let nextItem = $derived(currentIndex !== -1 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : undefined);

  let breadcrumbs = $derived(() => {
    if (data.page === 'index') {
      return [{ label: 'Documentación', href: '/docs' }];
    }
    const parts = data.slug.split('/');
    const langLabel = data.langs.find(l => l.code === parts[0])?.label || parts[0];
    const category = langTree?.children?.find(c =>
      c.children?.some(item => item.slug === data.slug)
    );
    return [
      { label: 'Documentación', href: '/docs' },
      { label: langLabel },
      { label: category?.label || parts[1] },
      { label: data.title }
    ];
  });

  function toggleCategory(label: string) {
    collapsed = { ...collapsed, [label]: !collapsed[label] };
  }

  function openLangMenu() {
    langOpen = true;
    if (langBtn) {
      const r = langBtn.getBoundingClientRect();
      langMenuStyle = `top:${r.bottom + 4}px;left:${r.left}px;width:${r.width}px`;
    }
  }

  function switchLang(code: string) {
    localStorage.setItem('docs-lang', code);
    selectedLang = code;
    langOpen = false;
    if (data.page === 'doc') {
      const articleName = data.slug.split('/').pop();
      for (const lang of data.tree) {
        if (lang.code === code) {
          for (const cat of lang.children || []) {
            for (const item of cat.children || []) {
              if (item.slug && item.slug.endsWith('/' + articleName)) {
                goto('/docs/' + item.slug);
                return;
              }
            }
          }
        }
      }
      goto('/docs');
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

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
  <title>{data.page === 'doc' ? data.title : 'Documentación'} — CubicLauncher Docs</title>
  {#if data.page === 'doc'}
    <meta name="description" content={data.description || `Documentación de CubicLauncher: ${data.title}.`} />
    <meta property="og:title" content="{data.title} — CubicLauncher Docs" />
    <meta property="og:description" content={data.description || `Documentación de CubicLauncher: ${data.title}.`} />
  {:else}
    <meta name="description" content="CubicLauncher Docs — Guías, referencias y recursos sobre CubicLauncher, el launcher de Minecraft multiplataforma." />
    <meta property="og:title" content="Documentación — CubicLauncher Docs" />
    <meta property="og:description" content="Guías, referencias y recursos sobre CubicLauncher." />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/favicon.png" />
</svelte:head>

<Header />

<div class="docs-layout">
  <button class="docs-sidebar-toggle" onclick={() => sidebarOpen = !sidebarOpen} aria-expanded={sidebarOpen}>
    <span>Índice</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class:rotated={sidebarOpen}><polyline points="6 9 12 15 18 9"/></svg>
  </button>

  <aside class="docs-sidebar" class:docs-sidebar-open={sidebarOpen}>
    <div class="docs-sidebar-inner">
      <div class="docs-sidebar-top">
        <h4 class="docs-sidebar-title">Documentación</h4>
        <div class="docs-lang-dropdown">
          <button bind:this={langBtn} class="docs-lang-btn" onclick={openLangMenu}>
            <span>{currentLang?.label}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class:lang-open={langOpen}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      <Search searchIndex={data.searchIndex} currentLang={currentLang?.code || 'es-ES'} />

      {#if langTree}
        <div class="docs-lang-group">
          {#each langTree.children || [] as cat}
            <div class="docs-cat-group">
              <button
                type="button"
                class="docs-cat-label"
                onclick={() => toggleCategory(cat.label)}
                aria-expanded={!collapsed[cat.label]}
              >
                {cat.label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class:rotated={!collapsed[cat.label]}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {#if !collapsed[cat.label]}
                <div class="docs-cat-items">
                  {#each cat.children || [] as item}
                    <a
                      href="/docs/{item.slug}"
                      class="docs-sidebar-link"
                      class:active={data.page === 'doc' && item.slug === data.slug}
                    >
                      {item.label}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </aside>

  {#if sidebarOpen}
    <div class="docs-sidebar-overlay" onclick={closeSidebar} role="presentation"></div>
  {/if}

  <main class="docs-content">
    {#if data.page === 'index'}
      <div class="docs-index">
        <h1>Documentación</h1>
        <p class="docs-index-desc">Guías, referencias y recursos sobre CubicLauncher: instala, configura y personaliza tu experiencia de Minecraft.</p>
        {#if langTree}
          <div class="docs-index-grid">
            {#each langTree.children || [] as cat}
              <div class="docs-index-card">
                <h3>{cat.label}</h3>
                <ul>
                  {#each cat.children || [] as item}
                    <li><a href="/docs/{item.slug}">{item.label}</a></li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <article class="docs-article" bind:this={articleWrap} use:attachCopyListeners use:attachLightbox>
        <nav class="docs-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {#each breadcrumbs() as crumb, i (crumb.label + i)}
              <li>
                {#if crumb.href}
                  <a href={crumb.href}>{crumb.label}</a>
                {:else}
                  <span aria-current="page">{crumb.label}</span>
                {/if}
              </li>
            {/each}
          </ol>
        </nav>

        {@html data.html}

        <div class="docs-page-nav">
          <div class="docs-page-nav-item prev">
            {#if prevItem}
              <span class="docs-page-nav-label">Anterior</span>
              <a href="/docs/{prevItem.slug}">← {prevItem.label}</a>
            {/if}
          </div>
          <div class="docs-page-nav-item next">
            {#if nextItem}
              <span class="docs-page-nav-label">Siguiente</span>
              <a href="/docs/{nextItem.slug}">{nextItem.label} →</a>
            {/if}
          </div>
        </div>

        <a
          href="https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/edit/main/src/docs/{data.slug}.md"
          target="_blank"
          rel="noopener noreferrer"
          class="docs-edit-link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar esta página en GitHub
        </a>
      </article>
    {/if}
  </main>

  {#if data.page === 'doc'}
    <DocToc headings={data.headings} />
  {/if}

  {#if langOpen}
    <div class="docs-lang-backdrop" onclick={() => langOpen = false} role="presentation"></div>
    <ul class="docs-lang-menu" style={langMenuStyle}>
      {#each data.langs as lang}
        <li>
          <button class="docs-lang-option" class:active={lang.code === currentLang?.code} onclick={() => switchLang(lang.code)}>
            {lang.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<Footer />

<ImageLightbox images={images} bind:openIndex={lightboxOpenIndex} />
