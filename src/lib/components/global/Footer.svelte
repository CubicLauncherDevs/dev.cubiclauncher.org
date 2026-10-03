<script lang="ts">
  import '../../../styles/Footer.css';

  let { docsHref = '/docs' }: { docsHref?: string } = $props();
</script>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-content">
      <div class="footer-brand">
        <a class="footer-title" href={docsHref}>CubicLauncher <span>Docs</span></a>
        <p>Guías y referencias de CubicLauncher.</p>
      </div>
      <nav class="footer-links" aria-label="Enlaces del pie de página">
        <a href={docsHref}>Documentación</a>
        <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://github.com/CubicLauncherDevs/CubicLauncher/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">GPL-3.0</a>
        <a href="https://discord.gg/7VaqSrPukm" target="_blank" rel="noopener noreferrer">Discord</a>
      </nav>
    </div>
    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} CubicLauncher Docs. CubicLauncher no está afiliado a Mojang AB.</p>
    </div>
  </div>
</footer>
