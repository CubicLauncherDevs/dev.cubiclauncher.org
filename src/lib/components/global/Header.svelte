<script lang="ts">
  import { page } from '$app/stores';
  import ThemeToggle from '$lib/components/docs/ThemeToggle.svelte';
  import '../../../styles/Header.css';

  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    requestAnimationFrame(() => {
      menuOpen = false;
    });
  }
</script>

<div class="header-wrapper">
  <header class="header">
    <div class="container">
      <div class="header-content">
        <a href="/docs" class="logo">
          <img src="/favicon.png" alt="CubicLauncher" class="logo-icon" />
          <span>CubicLauncher<span class="logo-accent">Docs</span></span>
        </a>
        <div class="header-actions">
          <ThemeToggle />
          <button class="hamburger" onclick={toggleMenu} aria-label="Menú de navegación" aria-expanded={menuOpen}>
            <span class="hamburger-line" class:open={menuOpen}></span>
            <span class="hamburger-line" class:open={menuOpen}></span>
            <span class="hamburger-line" class:open={menuOpen}></span>
          </button>
        </div>
      </div>
    </div>
  </header>

  {#if menuOpen}
    <div class="nav-overlay" onclick={closeMenu} role="presentation"></div>
  {/if}

  <nav class="nav" class:nav-open={menuOpen}>
    <span class="nav-group">
      <a href="/docs" class="nav-link" class:active={$page.url.pathname.startsWith('/docs')} class:docs-active={$page.url.pathname.startsWith('/docs')} onclick={closeMenu}>Docs</a>
    </span>
    <span class="nav-sep"></span>
    <span class="nav-group">
      <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="nav-link" onclick={closeMenu}>GitHub</a>
      <a href="https://discord.gg/7VaqSrPukm" target="_blank" rel="noopener noreferrer" class="nav-link" onclick={closeMenu}>Discord</a>
    </span>
  </nav>
</div>
