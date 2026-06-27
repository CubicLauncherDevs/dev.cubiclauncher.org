<script lang="ts">
  import '../../styles/home.css';
  import { getContributors, getLatestCommit } from '$lib/github';

  let contributors = $state<Awaited<ReturnType<typeof getContributors>>>([]);
  let latestCommit = $state<Awaited<ReturnType<typeof getLatestCommit>>>(null);

  $effect(() => {
    getContributors().then(d => contributors = d).catch(() => {});
    getLatestCommit().then(d => latestCommit = d).catch(() => {});
  });

  function timeAgo(date: string): string {
    const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (secs < 60) return 'hace unos segundos';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs} h`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `hace ${days} d`;
    return new Date(date).toLocaleDateString('es-ES');
  }

  function shortMessage(msg: string): string {
    return msg.split('\n')[0];
  }
</script>

<svelte:head>
  <title>CubicLauncher Devs — Launcher de Minecraft en Rust</title>
  <meta name="description" content="CubicLauncher es un launcher de Minecraft multiplataforma construido con Tauri v2, SvelteKit y Rust. Código abierto bajo licencia GPL-3.0." />
</svelte:head>

<section class="hero">
  <div class="container">
    <h1>
      CubicLauncher <br />
      <span class="text-accent">en Rust para más eficiencia</span>
    </h1>
    <p class="hero-desc">
      Multiplataforma, modular y de código abierto. Construido con Tauri&nbsp;v2, SvelteKit y un backend nativo
      en Rust con 6&nbsp;crates especializados y 77&nbsp;comandos IPC.
    </p>
    <div class="hero-actions">
      <a href="https://github.com/CubicLauncherDevs/CubicLauncher/releases" target="_blank" rel="noopener noreferrer" class="btn-primary">
        Descargar &darr;
      </a>
        <a href="/docs" target="_blank" rel="noopener noreferrer" class="btn-ghost">
        Documentacion &rarr;
      </a>
      <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="btn-ghost">
        Ver en GitHub &rarr;
      </a>
    </div>
    <img src="/show.png" alt="Captura de CubicLauncher" class="hero-img" />
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-label">tecnología</div>
    <h2>Tecnologías</h2>
    <p class="section-desc">Construido con un stack moderno que combina lo mejor de Rust y la web.</p>
    <div class="stack-grid">
      <div class="card">
        <div class="card-name">SvelteKit</div>
        <div class="card-sub">Meta-framework</div>
        <code>v2</code>
      </div>
      <div class="card">
        <div class="card-name">Svelte</div>
        <div class="card-sub">UI framework</div>
        <code>v5</code>
      </div>
      <div class="card">
        <div class="card-name">TypeScript</div>
        <div class="card-sub">Lenguaje</div>
        <code>v6</code>
      </div>
      <div class="card">
        <div class="card-name">Vite</div>
        <div class="card-sub">Bundler</div>
        <code>v8</code>
      </div>
      <div class="card">
        <div class="card-name">CSS</div>
        <div class="card-sub">Estilos vainilla</div>
        <code>Sin framework</code>
      </div>
      <div class="card">
        <div class="card-name">Bun</div>
        <div class="card-sub">Paquetes</div>
        <code>adapter-auto</code>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-label">arquitectura</div>
    <h2>Crates</h2>
    <p class="section-desc">6 crates Rust especializados. Modular por diseño.</p>
    <div class="crates-list">
      <div class="crate-row">
        <span class="crate-name">zellkern</span>
        <span class="crate-desc">Modelo de datos de Minecraft. Manifiestos, resolución de librerías, classpath, perfiles de loaders.</span>
      </div>
      <div class="crate-row">
        <span class="crate-name">aqua</span>
        <span class="crate-desc">Motor de descargas y gestor JRE. DownloadManager, progreso, instalación vía Azul Zulu.</span>
      </div>
      <div class="crate-row">
        <span class="crate-name">launchwerk</span>
        <span class="crate-desc">Orquestador de lanzamiento. Comando Java, spawn, stdout/stderr, auto-refresh de tokens con aes-gcm.</span>
      </div>
      <div class="crate-row">
        <span class="crate-name">cubrinth</span>
        <span class="crate-desc">Modpacks. Parsea .mrpack, resuelve dependencias, instala mods en instancias aisladas.</span>
      </div>
      <div class="crate-row">
        <span class="crate-name">communicator</span>
        <span class="crate-desc">Discord Rich Presence. Protocolo IPC de Discord para estado de juego.</span>
      </div>
      <div class="crate-row">
        <span class="crate-name">ablage</span>
        <span class="crate-desc">Caché binario en disco. CRC32, escrituras atómicas, índice ordenado.</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-label">funcionalidades</div>
    <h2>Características</h2>
    <p class="section-desc">Todo lo que necesitás para gestionar tus instancias.</p>
    <div class="features-grid">
      <div class="feat">
        <div class="feat-name">Instancias aisladas</div>
        <p>Cada instancia con su propia versión, mods, configs y ajustes JVM.</p>
      </div>
      <div class="feat">
        <div class="feat-name">Multi-loader</div>
        <p>Vanilla, Fabric, Forge, NeoForge y Quilt con detección automática.</p>
      </div>
      <div class="feat">
        <div class="feat-name">Autenticación</div>
        <p>Microsoft OAuth 2.0, Yggdrasil con authlib-injector y modo sin sesión.</p>
      </div>
      <div class="feat">
        <div class="feat-name">Modpacks</div>
        <p>Instalación desde Modrinth y CurseForge con resolución de dependencias.</p>
      </div>
      <div class="feat">
        <div class="feat-name">Temas</div>
        <p>Sistema de temas con edición en vivo vía file watcher y CSS custom properties.</p>
      </div>
      <div class="feat">
        <div class="feat-name">Rich Presence</div>
        <p>Integración con Discord para mostrar el estado de juego.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-label">colaboradores</div>
    <h2>Colaboradores del proyecto</h2>
    <p class="section-desc">Desarrolladores que hacen posible CubicLauncher.</p>
    {#if contributors.length > 0}
      <div class="members-grid">
        {#each contributors as c}
          <a href={c.html_url} target="_blank" rel="noopener noreferrer" class="member-card">
            <img src={c.avatar_url} alt={c.login} class="member-avatar" />
            <span class="member-name">{c.login}</span>
            <span class="member-contrib">{c.contributions} commits</span>
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-tertiary">Cargando colaboradores...</p>
    {/if}

    {#if latestCommit}
      <div class="latest-commit">
        <div class="latest-commit-header">
          <span class="latest-commit-icon">&#128196;</span>
          <span class="latest-commit-label">Último commit</span>
        </div>
        <a href={latestCommit.html_url} target="_blank" rel="noopener noreferrer" class="latest-commit-body">
          {#if latestCommit.author}
            <img src={latestCommit.author.avatar_url} alt="" class="latest-commit-avatar" />
          {/if}
          <div class="latest-commit-info">
            <span class="latest-commit-msg">{shortMessage(latestCommit.commit.message)}</span>
            <span class="latest-commit-meta">
              {latestCommit.commit.author.name} &middot; {timeAgo(latestCommit.commit.author.date)}
            </span>
          </div>
        </a>
      </div>
    {/if}
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="cta-inner">
      <h2>Contribuí al proyecto</h2>
      <p>CubicLauncher es software libre. Reportá bugs, proponé features o enviá tu primer PR.</p>
      <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer" class="btn-primary">
        Abrir GitHub &rarr;
      </a>
    </div>
  </div>
</section>
