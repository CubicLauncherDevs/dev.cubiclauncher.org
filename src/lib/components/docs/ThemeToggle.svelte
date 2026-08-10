<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let theme = $state<'dark' | 'light' | 'system'>('system');

  function resolvedTheme(t: typeof theme): 'dark' | 'light' {
    if (t === 'system') {
      if (browser && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }
    return t;
  }

  function apply(t: typeof theme) {
    const resolved = resolvedTheme(t);
    document.documentElement.setAttribute('data-theme', resolved);
    if (resolved === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  }

  function save(t: typeof theme) {
    if (browser) {
      localStorage.setItem('theme', t);
    }
    theme = t;
    apply(t);
  }

  function toggle() {
    const resolved = resolvedTheme(theme);
    save(resolved === 'dark' ? 'light' : 'dark');
  }

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      theme = stored;
    }
    apply(theme);
  });
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={toggle}
  aria-label="Cambiar tema"
  title="Cambiar tema"
>
  <svg class="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
  <svg class="moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
</button>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    padding: 0;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
  }

  .theme-toggle:hover {
    color: var(--text-primary);
    border-color: var(--text-muted);
    background: var(--bg-elevated);
  }

  .theme-toggle svg {
    position: absolute;
    transition: transform var(--transition-base), opacity var(--transition-base);
  }

  :global(html[data-theme="dark"]) .sun {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
  }

  :global(html[data-theme="dark"]) .moon {
    opacity: 1;
    transform: rotate(0) scale(1);
  }

  :global(html[data-theme="light"]) .sun {
    opacity: 1;
    transform: rotate(0) scale(1);
  }

  :global(html[data-theme="light"]) .moon {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }

  .moon {
    opacity: 1;
  }

  .sun {
    opacity: 0;
  }
</style>
