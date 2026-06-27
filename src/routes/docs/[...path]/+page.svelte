<script lang="ts">
  import Header from '$lib/components/global/Header.svelte';
  import Footer from '$lib/components/global/Footer.svelte';
  import '../../../styles/docs.css';

  export let data;

  $: defaultLang = data.page === 'doc' ? data.lang : 'es-ES';
  $: selectedLang = defaultLang;
  $: currentLang = data.langs.find(l => l.code === selectedLang) || data.langs[0];
  $: langTree = data.tree.find(l => l.code === currentLang?.code);
</script>

<svelte:head>
  <title>{data.page === 'doc' ? data.title : 'Documentación'} — CubicLauncher Devs</title>
</svelte:head>

<Header />

<div class="docs-layout">
  <aside class="docs-sidebar">
    <div class="docs-sidebar-inner">
      <div class="docs-lang-selector">
        <h4 class="docs-sidebar-title">Documentación</h4>
        <div class="docs-lang-pills">
          {#each data.langs as lang}
            <button
              class="docs-lang-pill"
              class:active={lang.code === currentLang?.code}
              on:click={() => selectedLang = lang.code}
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
