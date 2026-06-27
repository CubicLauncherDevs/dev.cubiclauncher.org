const cache = new Map<string, { data: unknown; expiry: number }>();

const TTL = 5 * 60 * 1000;

async function fetchCached<T>(key: string, url: string): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiry) return cached.data as T;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);

  const data = await res.json();
  cache.set(key, { data, expiry: Date.now() + TTL });
  return data as T;
}

export interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  html_url: string;
  author: { login: string; avatar_url: string } | null;
}

export async function getContributors(): Promise<Contributor[]> {
  const data = await fetchCached<Contributor[]>('contributors', 'https://api.github.com/repos/CubicLauncherDevs/CubicLauncher/contributors');
  return data.filter(c => c.type === 'User');
}

export async function getLatestCommit(): Promise<Commit | null> {
  const data = await fetchCached<Commit[]>('latest-commit', 'https://api.github.com/repos/CubicLauncherDevs/CubicLauncher/commits?per_page=1');
  return data[0] || null;
}

export interface RepoInfo {
  name: string;
  full_name: string;
  stargazers_count: number;
  description: string;
  license: { spdx_id: string } | null;
}

export async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo> {
  return fetchCached<RepoInfo>(`repo:${owner}/${repo}`, `https://api.github.com/repos/${owner}/${repo}`);
}
