<script lang="ts">
  import { page } from '$app/stores';
  import '../../../styles/Header.css';
</script>

<header class="header">
  <div class="container">
    <div class="header-content">
      <a href="/" class="logo">
        <img src="/favicon.png" alt="CubicLauncher" class="logo-icon" />
        <span>CubicLauncher</span>
      </a>
      <nav class="nav">
        <span class="nav-group">
          <a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>Inicio</a>
          <a href="/docs" class="nav-link" class:active={$page.url.pathname.startsWith('/docs')} class:docs-active={$page.url.pathname.startsWith('/docs')}>Docs</a>
          <a href="/projects" class="nav-link" class:active={$page.url.pathname === '/projects'}>Proyectos</a>
        </span>
        <span class="nav-sep"></span>
        <span class="nav-group">
          <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="nav-link">GitHub</a>
          <a href="https://discord.gg/7VaqSrPukm" target="_blank" rel="noopener noreferrer" class="nav-link">Discord</a>
        </span>
      </nav>
    </div>
  </div>
</header>
