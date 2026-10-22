import { env } from '$env/dynamic/private';

const GITHUB_API = 'https://api.github.com';
const ORG = 'CubicLauncherDevs';
const CACHE_TTL_MS = 60 * 60 * 1000;
const MAX_PAGES = 5;
const REQUEST_TIMEOUT_MS = 8000;

const REPOS = [
  { name: 'CubicLauncher', label: 'CubicLauncher' },
  { name: 'Translations', label: 'Translations' },
  { name: 'cubiclauncher.com', label: 'cubiclauncher.com' },
  { name: 'Themes', label: 'Themes' },
  { name: 'dev.cubiclauncher.org', label: 'dev.cubiclauncher.org' }
] as const;

export interface Contributor {
  id: number | string;
  login: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
  repos: string[];
}

interface GitHubContributor {
  id?: number;
  login?: string;
  avatar_url?: string;
  html_url?: string;
  contributions?: number;
  type?: string;
}

interface RepoContributors {
  repo: string;
  users: GitHubContributor[];
}

let cache: { expiresAt: number; data: Contributor[] } | null = null;
let pending: Promise<Contributor[]> | null = null;

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'CubicLauncher-Docs'
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  return headers;
}

function isGitHubContributor(value: unknown): value is GitHubContributor {
  if (!value || typeof value !== 'object') return false;
  const user = value as GitHubContributor;
  return typeof user.login === 'string';
}

function nextPage(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match?.[1] ?? null;
}

async function fetchRepoContributors(repo: string, fetchFn: typeof fetch): Promise<GitHubContributor[]> {
  const users: GitHubContributor[] = [];
  let url: string | null =
    `${GITHUB_API}/repos/${ORG}/${encodeURIComponent(repo)}/contributors?per_page=100&anon=0`;

  for (let page = 0; url && page < MAX_PAGES; page += 1) {
    const response = await fetchFn(url, {
      headers: githubHeaders(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    if (!response.ok) {
      throw new Error(`GitHub responded ${response.status} for ${repo}`);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new Error(`Unexpected GitHub response for ${repo}`);
    }

    users.push(...data.filter(isGitHubContributor));
    url = nextPage(response.headers.get('link'));
  }

  return users;
}

function mergeContributors(results: RepoContributors[]): Contributor[] {
  const byUser = new Map<string, Contributor>();

  for (const { repo, users } of results) {
    for (const user of users) {
      if (!user.login || !user.avatar_url || !user.html_url) continue;
      if (user.type === 'Bot' || /\[bot\]$/i.test(user.login)) continue;

      const key = user.id != null ? `id:${user.id}` : `login:${user.login.toLowerCase()}`;
      let contributor = byUser.get(key);

      if (!contributor) {
        contributor = {
          id: user.id ?? user.login.toLowerCase(),
          login: user.login,
          avatarUrl: user.avatar_url,
          profileUrl: user.html_url,
          contributions: 0,
          repos: []
        };
        byUser.set(key, contributor);
      }

      contributor.contributions += user.contributions ?? 0;
      if (!contributor.repos.includes(repo)) contributor.repos.push(repo);
    }
  }

  return [...byUser.values()].sort(
    (a, b) => b.contributions - a.contributions || a.login.localeCompare(b.login)
  );
}

async function fetchContributors(fetchFn: typeof fetch): Promise<Contributor[]> {
  const results = await Promise.allSettled(
    REPOS.map(async repo => ({
      repo: repo.label,
      users: await fetchRepoContributors(repo.name, fetchFn)
    }))
  );

  const successful: RepoContributors[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      console.warn('[contributors] Could not load a repository:', result.reason);
    }
  }

  return mergeContributors(successful);
}

export async function getContributors(fetchFn: typeof fetch): Promise<Contributor[]> {
  const now = Date.now();
  if (cache && now < cache.expiresAt) return cache.data;
  if (pending) return pending;

  pending = fetchContributors(fetchFn)
    .then(data => {
      if (data.length === 0) return cache?.data ?? [];

      cache = { expiresAt: Date.now() + CACHE_TTL_MS, data };
      return data;
    })
    .catch(error => {
      console.warn('[contributors] Could not load GitHub contributors:', error);
      return cache?.data ?? [];
    })
    .finally(() => {
      pending = null;
    });

  return pending;
}
