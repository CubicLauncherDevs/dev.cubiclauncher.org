<script lang="ts">
  import { onMount } from 'svelte';

  interface LightboxImage {
    src: string;
    alt: string;
  }

  let {
    images = [],
    openIndex = $bindable(-1),
    onClose
  }: {
    images: LightboxImage[];
    openIndex?: number;
    onClose?: () => void;
  } = $props();

  let isOpen = $derived(openIndex >= 0 && openIndex < images.length);
  let current = $derived(images[openIndex] || null);

  function close() {
    openIndex = -1;
    onClose?.();
  }

  function next() {
    if (images.length <= 1) return;
    openIndex = (openIndex + 1) % images.length;
  }

  function prev() {
    if (images.length <= 1) return;
    openIndex = (openIndex - 1 + images.length) % images.length;
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }

  function onKeydown(e: KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }

  onMount(() => {
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="docs-lightbox-overlay"
    onclick={onBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="Visor de imágenes"
    tabindex="-1"
  >
    <div class="docs-lightbox">
      <button type="button" class="docs-lightbox-close" onclick={close} aria-label="Cerrar visor">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      {#if images.length > 1}
        <button type="button" class="docs-lightbox-nav prev" onclick={prev} aria-label="Imagen anterior">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button type="button" class="docs-lightbox-nav next" onclick={next} aria-label="Imagen siguiente">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      {/if}

      <div class="docs-lightbox-content">
        {#if current}
          <img src={current.src} alt={current.alt} />
        {/if}
      </div>

      {#if current?.alt}
        <p class="docs-lightbox-caption">{current.alt}</p>
      {/if}

      {#if images.length > 1}
        <div class="docs-lightbox-counter">{openIndex + 1} / {images.length}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .docs-lightbox-overlay {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    padding: 1.5rem;
    animation: fadeIn 0.2s ease;
  }

  .docs-lightbox {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: 1200px;
  }

  .docs-lightbox-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .docs-lightbox-content img {
    max-width: 100%;
    max-height: calc(100vh - 140px);
    object-fit: contain;
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .docs-lightbox-close,
  .docs-lightbox-nav {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    z-index: 10;
    transition: all var(--transition-fast);
  }

  .docs-lightbox-close:hover,
  .docs-lightbox-nav:hover {
    background: var(--bg-elevated);
    border-color: var(--text-muted);
  }

  .docs-lightbox-close {
    top: 0;
    right: 0;
  }

  .docs-lightbox-nav {
    top: 50%;
    transform: translateY(-50%);
  }

  .docs-lightbox-nav.prev {
    left: 0;
  }

  .docs-lightbox-nav.next {
    right: 0;
  }

  .docs-lightbox-caption {
    margin-top: 1rem;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.875rem;
    max-width: 80%;
  }

  .docs-lightbox-counter {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    background: var(--bg-surface);
    border: 1px solid var(--border);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-md);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 640px) {
    .docs-lightbox-overlay {
      padding: 0.75rem;
    }

    .docs-lightbox-close,
    .docs-lightbox-nav {
      width: 36px;
      height: 36px;
    }

    .docs-lightbox-content img {
      max-height: calc(100vh - 120px);
    }

    .docs-lightbox-counter {
      top: auto;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    .docs-lightbox-caption {
      max-width: 100%;
      font-size: 0.8125rem;
    }
  }
</style>
