<script lang="ts">
  import { onMount } from 'svelte';
  import type { Heading } from '$lib/server/markdown';

  let { headings }: { headings: Heading[] } = $props();

  let activeId = $state('');
  let open = $state(true);
  let observers: IntersectionObserver[] = [];

  // Numeración jerárquica estilo MediaWiki: 1, 1.1, 1.1.1...
  let items = $derived.by(() => {
    const counters: number[] = [];
    return headings.map(h => {
      const level = Math.min(h.level, 4);
      while (counters.length > level - 1) counters.pop();   // reinicia niveles más profundos
      while (counters.length < level - 1) counters.push(0); // rellena niveles saltados
      const idx = Math.max(level - 2, 0);
      counters[idx] = (counters[idx] || 0) + 1;
      return { ...h, number: counters.join('.'), level };
    });
  });

  onMount(() => {
    const sectionElements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          activeId = visible[0].target.id;
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    sectionElements.forEach(el => observer.observe(el));
    observers.push(observer);

    return () => {
      observers.forEach(o => o.disconnect());
    };
  });
</script>

{#if headings.length > 0}
  <nav class="wiki-toc" aria-label="Tabla de contenidos" class:wiki-toc-collapsed={!open}>
    <div class="wiki-toc-title" role="button" tabindex="0" aria-expanded={open} onclick={() => open = !open} onkeydown={(e) => e.key === 'Enter' && (open = !open)}>
      <span class="wiki-toc-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
      Contenido
    </div>
    {#if open}
      <ul class="wiki-toc-list">
        {#each items as item}
          <li class="wiki-toc-item wiki-toc-l{item.level}">
            <a href="#{item.id}" class:active={activeId === item.id}>
              <span class="wiki-toc-number">{item.number}</span>
              {item.text.replace(/<[^>]+>/g, '')}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </nav>
{/if}

<style>
  .wiki-toc {
    display: inline-block;
    min-width: 280px;
    max-width: 100%;
    margin: 1rem 0 1.5rem;
    padding: 0.75rem 1.25rem 0.75rem 0.875rem;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    font-size: 0.875rem;
  }

  .wiki-toc-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    user-select: none;
  }

  .wiki-toc-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--accent);
    background: var(--accent-subtle);
    border: 1px solid var(--accent-border);
    border-radius: var(--radius-sm);
    line-height: 1;
  }

  .wiki-toc-list {
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;
  }

  .wiki-toc-item {
    margin: 0.2rem 0;
    line-height: 1.45;
  }

  .wiki-toc-l3 {
    margin-left: 1.25rem;
  }

  .wiki-toc-l4 {
    margin-left: 2.5rem;
  }

  .wiki-toc-item a {
    color: var(--text-secondary);
    text-decoration: none;
  }

  .wiki-toc-item a:hover {
    text-decoration: underline;
    color: var(--text-primary);
  }

  .wiki-toc-item a.active {
    color: var(--text-primary);
    font-weight: 600;
  }

  .wiki-toc-number {
    display: inline-block;
    min-width: 1.75rem;
    margin-right: 0.25rem;
    color: var(--text-tertiary);
    font-variant-numeric: tabular-nums;
  }

  .wiki-toc-item a:hover .wiki-toc-number,
  .wiki-toc-item a.active .wiki-toc-number {
    color: var(--text-primary);
  }

  @media (max-width: 640px) {
    .wiki-toc {
      min-width: 0;
      width: 100%;
    }
  }
</style>
