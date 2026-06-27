<section class="philosophy">
  <div class="container">
    <h2>Our Philosophy</h2>
    <div class="philosophy-grid">
      <div class="philosophy-item">
        <h3>Clean Code</h3>
        <p>We believe code should be readable, maintainable, and a pleasure to work with. Every line is an investment in the future.</p>
      </div>
      <div class="philosophy-item">
        <h3>Simplicity First</h3>
        <p>Complex problems deserve elegant solutions. We avoid unnecessary abstraction and over-engineering at all costs.</p>
      </div>
      <div class="philosophy-item">
        <h3>Community Driven</h3>
        <p>Your voice matters. We actively listen to contributors and make decisions that benefit the entire project ecosystem.</p>
      </div>
      <div class="philosophy-item">
        <h3>Open Development</h3>
        <p>Everything happens in the open. Discussions, decisions, and code are transparent and accessible to everyone.</p>
      </div>
    </div>
  </div>
</section>

<style>
  section {
    padding: var(--spacing-3xl) 0;
    background-color: var(--bg-secondary);
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  h2 {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-3xl);
    text-align: center;
  }

  .philosophy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
  }

  .philosophy-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .philosophy-item h3 {
    font-size: var(--font-size-lg);
    color: var(--accent);
  }

  .philosophy-item p {
    color: var(--text-secondary);
    line-height: var(--line-height-relaxed);
  }

  @media (max-width: 768px) {
    section {
      padding: var(--spacing-2xl) 0;
    }

    h2 {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--spacing-2xl);
    }

    .philosophy-grid {
      gap: var(--spacing-lg);
    }
  }
</style>
