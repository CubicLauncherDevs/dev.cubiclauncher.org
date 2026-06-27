<script lang="ts">
  import '../../styles/projects.css';
</script>

<svelte:head>
  <title>Proyectos — CubicLauncher Devs</title>
  <meta name="description" content="Proyectos del equipo CubicLauncher. Launcher de Minecraft en Rust, librerías y herramientas." />
</svelte:head>

<section class="page-hero">
  <div class="container">
    <h1>Proyectos</h1>
    <p class="page-hero-desc">Nuestros otros proyectos de codigo abierto</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-label">repositorios</div>
    <h2>Principales</h2>
    <p class="section-desc">Proyectos activos del equipo CubicLauncher.</p>
    <div class="projects-list">
      <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="project-card">
        <div class="project-top">
          <div class="project-name">
            <span class="project-repo-icon">&#9679;</span>
            CubicLauncher
          </div>
          <code>Rust</code>
        </div>
        <p class="project-desc">
          Nuevo CubicLauncher en Rust para más eficiencia y más personalizado y de código abierto. 
        </p>
        <div class="project-meta">
          <span class="project-stat">&#9733; ~0</span>
          <span class="project-stat">GPL-3.0</span>
        </div>
      </a>

      <a href="https://github.com/CubicLauncherDevs/cubiclauncher.com" target="_blank" rel="noopener noreferrer" class="project-card">
        <div class="project-top">
          <div class="project-name">
            <span class="project-repo-icon">&#9679;</span>
            cubiclauncher.com
          </div>
          <code>Svelte</code>
        </div>
        <p class="project-desc">
           Pagina oficial de cubicLauncher 
        </p>
        <div class="project-meta">
          <span class="project-stat">&#9733; ~0</span>
          <span class="project-stat">GPL-3.0</span>
        </div>
      </a>

      <a href="https://github.com/CubicLauncherDevs/Themes" target="_blank" rel="noopener noreferrer" class="project-card">
        <div class="project-top">
          <div class="project-name">
            <span class="project-repo-icon">&#9679;</span>
            Themes
          </div>
          <code>Zip</code>
        </div>
        <p class="project-desc">
           Repositorio comunitario de temas personalizados para CubicLauncher
        </p>
        <div class="project-meta">
          <span class="project-stat">&#9733; ~0</span>
          <span class="project-stat">CC0 1.0 Universal</span>
        </div>
      </a>

      <a href="https://github.com/CubicLauncherDevs/authlib-injector" target="_blank" rel="noopener noreferrer" class="project-card">
        <div class="project-top">
          <div class="project-name">
            <span class="project-repo-icon">&#9679;</span>
            authlib-injector
          </div>
          <code>Java</code>
        </div>
        <p class="project-desc">
           Build your own Minecraft authentication system. (FORK: yushijinhun)
        </p>
        <div class="project-meta">
          <span class="project-stat">&#9733; ~0</span>
          <span class="project-stat">CC0 1.0 Universal</span>
        </div>
      </a>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="cta-inner">
      <h2>¿Querés contribuir?</h2>
      <p>Todos nuestros proyectos son open source. Mandá un PR o abrí un issue.</p>
      <a href="https://github.com/CubicLauncherDevs" target="_blank" rel="noopener noreferrer" class="btn-primary">
        Ver organización &rarr;
      </a>
    </div>
  </div>
</section>
