<script lang="ts">
  import Button from './Button.svelte';
</script>

<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content">
        <h1 class="hero-title">Build the next generation Minecraft Launcher</h1>
        <p class="hero-description">
          Contribute to CubicLauncher, a modern, open-source launcher built by developers, for developers.
          Join the community and help shape the future of Minecraft launching.
        </p>
        <div class="hero-buttons">
          <Button href="https://github.com/CubicLauncherDevs/CubicLauncher" variant="primary">
            View on GitHub
          </Button>
          <Button href="#" variant="secondary">
            Read Documentation
          </Button>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="code-window">
          <div class="code-header">
            <span>main.rs</span>
          </div>
          <div class="code-content">
          <pre><code>// Modern architecture
// Open source
// Fast development
// Built for contributors

mod launcher {'{'}
  pub fn start() {'{'}
    println!("Ready");
  {'}'}
{'}'}
</code></pre>
        </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: var(--spacing-3xl) 0;
    background: linear-gradient(
      135deg,
      var(--bg-primary) 0%,
      var(--bg-secondary) 100%
    );
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3xl);
    align-items: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .hero-title {
    font-size: var(--font-size-5xl);
    line-height: var(--line-height-tight);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
  }

  .hero-description {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    line-height: var(--line-height-relaxed);
  }

  .hero-buttons {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .hero-visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .code-window {
    width: 100%;
    max-width: 400px;
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    animation: slideUp 0.8s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .code-header {
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
  }

  .code-content {
    padding: var(--spacing-md);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: var(--line-height-relaxed);
    color: var(--accent-light);
  }

  .code-content pre {
    margin: 0;
    overflow-x: auto;
  }

  .code-content code {
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .hero {
      padding: var(--spacing-2xl) 0;
    }

    .hero-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-2xl);
    }

    .hero-title {
      font-size: var(--font-size-4xl);
    }

    .hero-description {
      font-size: var(--font-size-base);
    }

    .hero-buttons {
      flex-direction: column;
    }

    .code-window {
      max-width: 100%;
    }
  }
</style>
