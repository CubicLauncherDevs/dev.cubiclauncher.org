<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$lib/components/global/Header.svelte';
  import Footer from '$lib/components/global/Footer.svelte';

  let status = $derived($page.status);
  let message = $derived($page.error?.message || 'Página no encontrada');
</script>

<svelte:head>
  <title>{status === 404 ? 'Página no encontrada' : 'Error'} — CubicLauncher Docs</title>
  <meta name="description" content="Lo sentimos, no pudimos encontrar la página que buscás. Volvé a la documentación de CubicLauncher." />
</svelte:head>

<Header />

<main class="error-page">
  <div class="error-content">
    <span class="error-code">{status}</span>
    <h1>{status === 404 ? 'Página no encontrada' : 'Algo salió mal'}</h1>
    <p>{status === 404 ? 'La documentación que buscás no existe o fue movida.' : message}</p>
    <div class="error-actions">
      <a href="/docs" class="error-primary">Volver a la documentación</a>
      <a href="https://github.com/CubicLauncherDevs/dev.cubiclauncher.org/issues" target="_blank" rel="noopener noreferrer" class="error-secondary">Reportar un problema</a>
    </div>
  </div>
</main>

<Footer />

<style>
  .error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 180px);
    padding: 2rem 1rem;
  }

  .error-content {
    text-align: center;
    max-width: 480px;
  }

  .error-code {
    display: block;
    font-family: var(--font-mono);
    font-size: 5rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-tertiary);
    margin-bottom: 2rem;
  }

  .error-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .error-actions a {
    text-decoration: none;
    padding: 0.625rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 500;
    transition: all var(--transition-fast);
  }

  .error-primary {
    background: var(--text-primary);
    color: var(--bg-base);
  }

  .error-primary:hover {
    background: var(--text-secondary);
    color: var(--bg-base);
  }

  .error-secondary {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    color: var(--text-secondary);
  }

  .error-secondary:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
  }

  @media (max-width: 640px) {
    .error-code {
      font-size: 4rem;
    }

    .error-actions {
      flex-direction: column;
    }
  }
</style>
