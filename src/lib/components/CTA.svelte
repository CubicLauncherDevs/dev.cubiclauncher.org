<script lang="ts">
  import Button from './Button.svelte';
</script>

<section class="cta">
  <div class="container">
    <div class="cta-content">
      <h2>Ready to make an impact?</h2>
      <p>Join thousands of developers contributing to CubicLauncher. Whether you're fixing bugs, adding features, or improving documentation, your contributions matter.</p>
      <Button href="https://github.com/CubicLauncherDevs/CubicLauncher" variant="primary" size="lg">
        Start Contributing
      </Button>
    </div>
  </div>
</section>

<style>
  section {
    padding: var(--spacing-3xl) 0;
    background: linear-gradient(
      135deg,
      var(--bg-secondary) 0%,
      var(--bg-tertiary) 100%
    );
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .cta-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  h2 {
    font-size: var(--font-size-4xl);
    max-width: 600px;
  }

  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    max-width: 600px;
    line-height: var(--line-height-relaxed);
  }

  @media (max-width: 768px) {
    section {
      padding: var(--spacing-2xl) 0;
    }

    h2 {
      font-size: var(--font-size-3xl);
    }

    p {
      font-size: var(--font-size-base);
    }
  }
</style>
