<script lang="ts">
  import { onMount } from 'svelte';
  import type { Heading } from '$lib/server/markdown';

  let { headings }: { headings: Heading[] } = $props();

  let activeId = $state('');
  let observers: IntersectionObserver[] = [];

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
  <nav class="doc-toc" aria-label="Tabla de contenidos">
    <div class="doc-toc-inner">
      <h4 class="doc-toc-title">En esta página</h4>
      <ul>
        {#each headings as heading}
          <li class="toc-level-{heading.level}">
            <a
              href="#{heading.id}"
              class:active={activeId === heading.id}
            >
              {heading.text.replace(/<[^>]+>/g, '')}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </nav>
{/if}

<style>
  .doc-toc {
    width: 220px;
    flex-shrink: 0;
    padding: 2rem 0 2rem 2rem;
    border-left: 1px solid var(--border-subtle);
    position: sticky;
    top: 72px;
    align-self: flex-start;
    max-height: calc(100vh - 88px);
    overflow-y: auto;
  }

  .doc-toc-inner {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .doc-toc-title {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .doc-toc ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .doc-toc li {
    line-height: 1.35;
  }

  .doc-toc a {
    display: block;
    font-size: 0.8125rem;
    color: var(--text-tertiary);
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-left: 2px solid transparent;
    margin-left: -2px;
    transition: all var(--transition-fast);
  }

  .doc-toc a:hover {
    color: var(--text-primary);
    border-left-color: var(--border);
  }

  .doc-toc a.active {
    color: var(--text-primary);
    border-left-color: var(--text-primary);
    font-weight: 500;
  }

  .toc-level-3 a {
    padding-left: 1rem;
    font-size: 0.75rem;
  }

  .toc-level-4 a {
    padding-left: 1.5rem;
    font-size: 0.75rem;
  }

  @media (max-width: 1100px) {
    .doc-toc {
      display: none;
    }
  }
</style>
