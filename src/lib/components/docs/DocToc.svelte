<script lang="ts">
  import { onMount } from 'svelte';
  import type { Heading } from '$lib/server/markdown';

  let { headings }: { headings: Heading[] } = $props();

  let activeId = $state('');
  let open = $state(true);

  // Numeración jerárquica estilo MediaWiki: 1, 1.1, 1.1.1...
  let items = $derived.by(() => {
    const counters: number[] = [];
    const baseLevel = Math.min(...headings.map(h => h.level));
    return headings.map(h => {
      const level = Math.min(h.level, 4);
      const depth = Math.min(Math.max(level - baseLevel, 0), counters.length);
      counters.length = Math.min(counters.length, depth + 1);
      counters[depth] = (counters[depth] || 0) + 1;
      return { ...h, number: counters.join('.'), level };
    });
  });

  onMount(() => {
    const sectionElements = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    let frame = 0;
    function update() {
      frame = 0;
      const offset = window.innerWidth <= 900 ? 145 : 95;
      let current = sectionElements[0]?.id || '';
      for (const el of sectionElements) {
        if (el.getClientRects().length && el.getBoundingClientRect().top <= offset) current = el.id;
      }
      activeId = current;
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  });
</script>

{#if headings.length > 0}
  <nav class="wiki-toc" aria-label="Tabla de contenidos" class:wiki-toc-collapsed={!open}>
    <button type="button" class="wiki-toc-title" aria-expanded={open} aria-controls="wiki-toc-list" onclick={() => open = !open}>
      <span class="wiki-toc-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
      En esta página
    </button>
    {#if open}
      <ul class="wiki-toc-list" id="wiki-toc-list">
        {#each items as item}
          <li class="wiki-toc-item wiki-toc-l{item.level}">
            <a href="#{item.id}" class:active={activeId === item.id} aria-current={activeId === item.id ? 'location' : undefined}>
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
    display: block;
    max-width: 100%;
    padding: 0.75rem 0 0.75rem 1rem;
    border-left: 1px solid var(--border);
    font-size: 0.8125rem;
  }

  .wiki-toc-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    user-select: none;
    font: inherit;
    font-weight: 600;
    background: none;
    border: 0;
    padding: 0;
    text-align: left;
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
    margin: 0.375rem 0;
    line-height: 1.45;
  }

  .wiki-toc-l3 {
    margin-left: 0.75rem;
  }

  .wiki-toc-l4 {
    margin-left: 1.5rem;
  }

  .wiki-toc-item a {
    display: block;
    padding: 0.2rem 0;
    color: var(--text-secondary);
    text-decoration: none;
  }

  .wiki-toc-item a:hover {
    text-decoration: underline;
    color: var(--text-primary);
  }

  .wiki-toc-item a.active {
    color: var(--accent);
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

  @media (max-width: 1199px) {
    .wiki-toc {
      padding: 0.875rem 1rem;
      background: var(--bg-base);
      border: 1px solid var(--border);
    }
  }
</style>
