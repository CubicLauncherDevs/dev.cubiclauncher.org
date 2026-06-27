<script lang="ts">
  export let href: string;
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<a {href} class="button button--{variant} button--{size}">
  <slot />
</a>

<style>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
  }

  .button--sm {
    font-size: var(--font-size-sm);
    padding: 0.5rem 1rem;
  }

  .button--md {
    font-size: var(--font-size-base);
    padding: 0.75rem 1.5rem;
  }

  .button--lg {
    font-size: var(--font-size-lg);
    padding: 1rem 2rem;
  }

  .button--primary {
    background-color: var(--accent);
    color: var(--bg-primary);
  }

  .button--primary:hover {
    background-color: var(--accent-light);
    transform: translateY(-2px);
  }

  .button--secondary {
    background-color: transparent;
    border-color: var(--border);
    color: var(--text-primary);
  }

  .button--secondary:hover {
    background-color: var(--bg-hover);
    border-color: var(--text-tertiary);
  }

  .button--ghost {
    background-color: transparent;
    color: var(--accent);
  }

  .button--ghost:hover {
    color: var(--accent-light);
  }
</style>
