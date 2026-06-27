<script lang="ts">
  import { navigating } from '$app/stores';
  import '../app.css';

  let { children } = $props();
</script>

{#if $navigating}
  <div class="loading-overlay visible">
    <div class="loading-overlay-inner">
      <img src="/rei.png" alt="Cargando" />
      <p>Cargando...</p>
    </div>
  </div>
{/if}

{@render children()}

<style>
  .loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 9998;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-base);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .loading-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }

  .loading-overlay-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .loading-overlay-inner img {
    width: 64px;
    height: 64px;
    border-radius: 10px;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .loading-overlay-inner p {
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    color: var(--text-tertiary);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
</style>
