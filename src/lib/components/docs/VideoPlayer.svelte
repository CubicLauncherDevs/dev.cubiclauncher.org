<script lang="ts">
  let { src, title = 'Video' }: { src: string; title?: string } = $props();

  function extractYouTubeId(input: string): string | null {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  }

  function isVideoFile(input: string): boolean {
    return /\.(mp4|webm|mov|mkv|ogv)(\?.*)?$/i.test(input);
  }

  let youtubeId = $derived(extractYouTubeId(src));
  let isLocalVideo = $derived(isVideoFile(src));
</script>

<div class="docs-video">
  {#if youtubeId}
    <iframe
      src="https://www.youtube-nocookie.com/embed/{youtubeId}"
      title={title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="lazy"
    ></iframe>
  {:else if isLocalVideo}
    <video controls preload="metadata">
      <source src={src} />
      <p>Tu navegador no soporta la reproducción de video.</p>
    </video>
  {:else}
    <div class="docs-video-fallback">
      <p>Formato de video no reconocido: <code>{src}</code></p>
    </div>
  {/if}
</div>

<style>
  .docs-video {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin: 1.5rem 0;
  }

  .docs-video iframe,
  .docs-video video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    object-fit: contain;
    background: #000;
  }

  .docs-video-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 1rem;
    text-align: center;
    color: var(--text-tertiary);
  }

  .docs-video-fallback code {
    word-break: break-all;
  }
</style>
