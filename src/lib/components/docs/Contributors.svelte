<script lang="ts">
  import type { Contributor } from '$lib/server/contributors';

  let {
    contributors,
    title,
    subtitle,
    contributionLabel
  }: {
    contributors: Contributor[];
    title: string;
    subtitle: string;
    contributionLabel: (count: number) => string;
  } = $props();
</script>

<section class="wiki-contributors" aria-labelledby="contributors-heading">
  <h2 class="wiki-contributors-title" id="contributors-heading">{title}</h2>
  <p class="wiki-contributors-subtitle">{subtitle}</p>
  <ul class="wiki-contributor-grid">
    {#each contributors as contributor (contributor.id)}
      <li>
        <a
          class="wiki-contributor"
          href={contributor.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`@${contributor.login} · ${contributor.repos.join(', ')} · ${contributionLabel(contributor.contributions)}`}
        >
          <img
            src={contributor.avatarUrl}
            alt=""
            width="36"
            height="36"
            loading="lazy"
            decoding="async"
          />
          <span class="wiki-contributor-info">
            <span class="wiki-contributor-login">@{contributor.login}</span>
            <span class="wiki-contributor-meta">{contributionLabel(contributor.contributions)}</span>
          </span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  .wiki-contributors {
    margin: 0 0 1.75rem;
  }

  .wiki-contributors-title {
    font-size: 1.25rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0.5rem;
  }

  .wiki-contributors-subtitle {
    color: var(--text-tertiary);
    font-size: 0.8125rem;
    margin-bottom: 0.75rem;
  }

  .wiki-contributor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .wiki-contributor {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
    padding: 0.45rem 0.6rem;
    background: var(--bg-base);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: border-color var(--transition-fast), background var(--transition-fast);
  }

  .wiki-contributor:hover {
    background: var(--bg-elevated);
    border-color: var(--accent-border);
  }

  .wiki-contributor:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .wiki-contributor img {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-elevated);
  }

  .wiki-contributor-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.25;
  }

  .wiki-contributor-login {
    overflow: hidden;
    color: var(--text-primary);
    font-size: 0.8125rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .wiki-contributor-meta {
    color: var(--text-muted);
    font-size: 0.6875rem;
  }

  @media (max-width: 600px) {
    .wiki-contributor-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .wiki-contributor {
      gap: 0.5rem;
      padding: 0.4rem 0.5rem;
    }

    .wiki-contributor img {
      width: 30px;
      height: 30px;
    }
  }

  @media (max-width: 380px) {
    .wiki-contributor-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
