<script lang="ts">
  import Card from './Card.svelte';
  
  const features = [
    {
      title: 'Modern Architecture',
      description: 'Built with clean, maintainable code that follows Rust best practices and modern design patterns.',
      icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
      </svg>`
    },
    {
      title: 'Open Source',
      description: 'Completely open-source project that welcomes contributions from developers of all skill levels.',
      icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/>
        <path d="M12 15c2.21 0 4 1.79 4 4"/>
      </svg>`
    },
    {
      title: 'Fast Development',
      description: 'Quick iteration cycles with comprehensive tooling and documentation for developers.',
      icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="13 2 13 9 20 9"/>
      </svg>`
    },
    {
      title: 'Built for Contributors',
      description: 'Thoughtfully designed to make contributing rewarding and straightforward for everyone.',
      icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>`
    }
  ];
</script>

<section class="features">
  <div class="container">
    <div class="features-header">
      <h2>Why contribute?</h2>
      <p>CubicLauncher is built on principles that make development enjoyable and sustainable.</p>
    </div>
    <div class="features-grid">
      {#each features as feature (feature.title)}
        <Card
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      {/each}
    </div>
  </div>
</section>

<style>
  .features {
    padding: var(--spacing-3xl) 0;
    background-color: var(--bg-primary);
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .features-header {
    text-align: center;
    margin-bottom: var(--spacing-3xl);
  }

  .features-header h2 {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-md);
  }

  .features-header p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    .features {
      padding: var(--spacing-2xl) 0;
    }

    .features-header {
      margin-bottom: var(--spacing-2xl);
    }

    .features-header h2 {
      font-size: var(--font-size-3xl);
    }

    .features-header p {
      font-size: var(--font-size-base);
    }

    .features-grid {
      gap: var(--spacing-md);
    }
  }
</style>
