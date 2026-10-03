<script lang="ts">
  import { tick } from 'svelte';
  import { goto } from '$app/navigation';
  import type { SearchDoc } from '$lib/server/docs';

  let { searchIndex, currentLang, onOpen }: { searchIndex: SearchDoc[]; currentLang: string; onOpen?: () => void } = $props();

  let query = $state('');
  let open = $state(false);
  let inputEl = $state<HTMLInputElement | undefined>(undefined);
  let dialogEl: HTMLDialogElement;
  let activeIndex = $state(0);

  function normalize(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  let results = $derived.by(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    const words = q.split(/\s+/);
    return searchIndex.filter(d => d.lang === currentLang)
      .map(doc => {
        const title = normalize(doc.title);
        const text = normalize(`${doc.title} ${doc.category} ${doc.description} ${doc.excerpt}`);
        const score = words.every(word => text.includes(word))
          ? (title === q ? 100 : title.startsWith(q) ? 50 : title.includes(q) ? 30 : 1)
            + words.filter(word => title.includes(word)).length * 5 : 0;
        return { doc, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
      .slice(0, 12).map(result => result.doc);
  });

  async function openSearch() {
    if (open) return;
    open = true;
    onOpen?.();
    await tick();
    dialogEl.showModal();
    inputEl?.focus();
  }

  function closeSearch() {
    dialogEl?.close();
    open = false;
    query = '';
    activeIndex = 0;
  }

  function navigate(slug: string) {
    closeSearch();
    goto('/docs/' + slug);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (open) closeSearch();
      else openSearch();
    }
  }

  function onInputKeydown(e: KeyboardEvent) {
    if (e.isComposing || !results.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      document.getElementById(`search-result-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigate(results[activeIndex].slug);
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<button type="button" class="search-trigger" onclick={openSearch} aria-label="Buscar documentación">
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>    <span class="search-placeholder">Buscar en la documentación...</span>
  <kbd class="search-kbd">Ctrl K</kbd>
</button>

<dialog bind:this={dialogEl} class="search-modal" aria-label="Búsqueda de documentación" onclose={closeSearch} onclick={(e) => { if (e.target === dialogEl) closeSearch(); }}>
  <div class="search-panel" role="presentation">
    <div class="search-input-wrap">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
      <input
        type="text"
        role="combobox"
        aria-label="Buscar artículos"
        aria-expanded={results.length > 0}
        aria-activedescendant={results.length ? `search-result-${activeIndex}` : undefined}
        bind:this={inputEl}
        aria-controls="search-results-list"
        bind:value={query}
        oninput={() => activeIndex = 0}
        onkeydown={onInputKeydown}
        placeholder="Buscar en la documentación..."
        aria-autocomplete="list"
        autocomplete="off"
        spellcheck="false"
      />
      <button type="button" class="search-close" onclick={closeSearch} aria-label="Cerrar búsqueda">Esc</button>
    </div>
    <p class="search-status" role="status">{results.length ? `${results.length} resultados · ${currentLang}` : `Búsqueda en ${currentLang}`}</p>
    <div class="search-results" role="listbox" aria-label="Artículos encontrados" id="search-results-list">
      {#if results.length === 0}
        <div class="search-empty">
          {#if query.trim().length < 2}
            Escribe al menos 2 caracteres para buscar.
          {:else}
            No se encontraron resultados. Prueba con menos palabras o cambia el idioma de la documentación.
          {/if}
        </div>
      {:else}
        {#each results as result, idx}
          <button
            type="button"
            class="search-result"
            id="search-result-{idx}"
            tabindex="-1"
            onclick={() => navigate(result.slug)}
            role="option"
            aria-selected={idx === activeIndex}
          >
            <span class="search-result-title">{result.title}</span>
            <span class="search-result-meta">{result.category} · {result.lang}</span>
            {#if result.description}
              <span class="search-result-excerpt">{result.description}</span>
            {:else if result.excerpt}
              <span class="search-result-excerpt">{result.excerpt}</span>
            {/if}
          </button>
        {/each}
      {/if}
    </div>
    <div class="search-footer">
      <span><kbd>↑</kbd> <kbd>↓</kbd> navegar</span>
      <span><kbd>Enter</kbd> seleccionar</span>
      <span><kbd>Esc</kbd> cerrar</span>
    </div>
  </div>
</dialog>

<style>
  .search-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    font-family: var(--font-sans);
    color: var(--text-tertiary);
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .search-trigger:hover {
    color: var(--text-primary);
    border-color: var(--text-muted);
    background: var(--bg-elevated);
  }

  .search-placeholder {
    flex: 1;
    text-align: left;
  }

  .search-kbd {
    display: none;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    padding: 0.125rem 0.375rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-muted);
  }

  @media (min-width: 641px) {
    .search-kbd {
      display: inline-block;
    }
  }

  .search-modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  .search-modal {
    position: fixed;
    top: 15vh;
    margin: 0 auto;
    padding: 0;
    width: min(640px, calc(100vw - 2rem));
    background: var(--bg-surface);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    z-index: 301;
    overflow: hidden;
    max-height: calc(100dvh - 2rem);
  }

  .search-panel { display: flex; flex-direction: column; max-height: min(680px, 80dvh); }
  .search-status { padding: 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border); }

  .search-input-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-bottom: 1px solid var(--border);
    color: var(--text-tertiary);
  }

  .search-input-wrap input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: var(--font-sans);
    font-size: 0.9375rem;
  }

  .search-input-wrap input::placeholder {
    color: var(--text-muted);
  }

  .search-close {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-tertiary);
    cursor: pointer;
  }

  .search-close:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  .search-results {
    max-height: 360px;
    overflow-y: auto;
    min-height: 0;
  }

  .search-empty {
    padding: 2rem;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .search-result {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-secondary);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .search-result:last-child {
    border-bottom: none;
  }

  .search-result:hover,
  .search-result[aria-selected="true"],
  .search-result:focus {
    background: var(--accent-subtle);
    outline: none;
  }

  .search-result-title {
    font-weight: 600;
    color: var(--text-primary);
  }

  .search-result-meta {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .search-result-excerpt {
    font-size: 0.8125rem;
    color: var(--text-tertiary);
    line-height: 1.5;
  }

  .search-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0.5rem 1rem;
    background: var(--bg-base);
    border-top: 1px solid var(--border);
    font-size: 0.6875rem;
    color: var(--text-muted);
  }

  .search-footer kbd {
    display: inline-block;
    padding: 0.0625rem 0.25rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  @media (max-width: 640px) {
    .search-modal {
      top: auto;
      bottom: 0;
      left: 0;
      right: 0;
      transform: none;
      width: 100%;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }

    .search-footer {
      display: none;
    }
  }
</style>
