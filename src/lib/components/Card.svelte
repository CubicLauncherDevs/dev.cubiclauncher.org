<script lang="ts">
  export let icon: string;
  export let title: string;
  export let description: string;
</script>

<article class="card">
  <div class="card-icon" aria-hidden="true">
    {@html icon}
  </div>
  <div class="card-content">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
</article>

<style>
  .card {
    padding: var(--spacing-lg);
    background-color: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition: all var(--transition-base);
  }

  .card:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--text-tertiary);
    transform: translateY(-4px);
  }

  .card-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.card-icon svg) {
    width: 100%;
    height: 100%;
    stroke: var(--accent);
    fill: none;
    stroke-width: 1.5;
  }

  .card-content h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
  }

  .card-content p {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
</style>
