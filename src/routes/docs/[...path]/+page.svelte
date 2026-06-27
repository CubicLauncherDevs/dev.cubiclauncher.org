<script lang="ts">
  import { goto } from '$app/navigation';
  import Header from '$lib/components/global/Header.svelte';
  import Footer from '$lib/components/global/Footer.svelte';
  import '../../../styles/docs.css';

  let { data } = $props();

  function defaultLang() {
    return data.page === 'doc' ? data.lang : 'es-ES';
  }

  let selectedLang = $state(defaultLang());
  let sidebarOpen = $state(false);

  $effect(() => {
    selectedLang = defaultLang();
  });

  let currentLang = $derived(data.langs.find(l => l.code === selectedLang) || data.langs[0]);
  let langTree = $derived(data.tree.find(l => l.code === currentLang?.code));

  function switchLang(code: string) {
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
    } else {
      selectedLang = code;
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
  }
</script>

<svelte:head>
  <title>{data.page === 'doc' ? data.title : 'Documentación'} — CubicLauncher Devs</title>
</svelte:head>

<Header />

<div class="docs-layout">
  <button class="docs-sidebar-toggle" onclick={() => sidebarOpen = !sidebarOpen} aria-expanded={sidebarOpen}>
    <span>Índice</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class:rotated={sidebarOpen}><polyline points="6 9 12 15 18 9"/></svg>
  </button>
  <aside class="docs-sidebar" class:docs-sidebar-open={sidebarOpen}>
    <div class="docs-sidebar-inner">
      <div class="docs-lang-selector">
        <h4 class="docs-sidebar-title">Documentación</h4>
        <div class="docs-lang-pills">
          {#each data.langs as lang}
            <button
              class="docs-lang-pill"
              class:active={lang.code === currentLang?.code}
              onclick={() => switchLang(lang.code)}
            >{lang.label}</button>
          {/each}
        </div>
      </div>
      {#if langTree}
        <div class="docs-lang-group">
          {#each langTree.children || [] as cat}
            <div class="docs-cat-group">
              <span class="docs-cat-label">{cat.label}</span>
              {#each cat.children || [] as item}
                <a href="/docs/{item.slug}" class="docs-sidebar-link" class:active={data.page === 'doc' && item.slug === data.slug}>
                  {item.label}
                </a>
              {/each}
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
        <p class="docs-index-desc">Guías, referencias y recursos sobre CubicLauncher.</p>
        {#if langTree}
          <div class="docs-index-lang">
            <h2>{currentLang?.label}</h2>
            {#each langTree.children || [] as cat}
              <div class="docs-index-cat">
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
      <article class="docs-article">
        <h1>{data.title}</h1>
        {@html data.html}
      </article>
    {/if}
  </main>
</div>

<Footer />
