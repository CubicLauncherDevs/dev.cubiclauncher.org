<script lang="ts">
  import Button from './Button.svelte';
</script>

<header class="header">
  <div class="container">
    <div class="header-content">
      <a href="/" class="logo" aria-label="CubicLauncher Home">
        <span class="logo-text">CubicLauncher</span>
      </a>
      <nav class="nav" aria-label="Main navigation">
        <a href="/" class="nav-link">Home</a>
        <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="nav-link">GitHub</a>
        <a href="/" class="nav-link">Documentation</a>
      </nav>
    </div>
  </div>
</header>

<style>
  .header {
    background-color: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) 0;
    gap: var(--spacing-lg);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    text-decoration: none;
    transition: opacity var(--transition-fast);
    flex-shrink: 0;
  }

  .logo:hover {
    opacity: 0.8;
  }

  .logo-text {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
  }

  .nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .nav-link {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    transition: color var(--transition-fast);
    position: relative;
  }

  .nav-link:hover {
    color: var(--accent);
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .nav {
      width: 100%;
      gap: var(--spacing-md);
      justify-content: center;
    }
  }
</style>
