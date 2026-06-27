<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-section">
        <h4>CubicLauncher</h4>
        <p>Build the next generation Minecraft Launcher.</p>
      </div>
      <div class="footer-links">
        <a href="https://github.com/CubicLauncherDevs/CubicLauncher" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://github.com/CubicLauncherDevs/CubicLauncher/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">License</a>
        <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">Discord</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 CubicLauncher. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background-color: var(--bg-secondary);
    border-top: 1px solid var(--border);
    padding: var(--spacing-2xl) 0;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .footer-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-3xl);
    margin-bottom: var(--spacing-2xl);
    padding-bottom: var(--spacing-2xl);
    border-bottom: 1px solid var(--border);
    align-items: start;
  }

  .footer-section h4 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
  }

  .footer-section p {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .footer-links {
    display: flex;
    gap: var(--spacing-lg);
    justify-content: flex-end;
  }

  .footer-links a {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    transition: color var(--transition-fast);
  }

  .footer-links a:hover {
    color: var(--accent);
  }

  .footer-bottom {
    text-align: center;
  }

  .footer-bottom p {
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
  }

  @media (max-width: 768px) {
    .footer {
      padding: var(--spacing-xl) 0;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
    }

    .footer-links {
      justify-content: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
