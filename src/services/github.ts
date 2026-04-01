import type {
  GitHubSearchResponse,
  GitHubRepository,
  GitHubContributor,
  GitHubIssue,
  RepositoryDetails,
} from "@/types/github";

const BASE_URL = "https://api.github.com";
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  ...(TOKEN && { Authorization: `token ${TOKEN}` }),
};

export class GitHubApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message =
      response.status === 403
        ? "API rate limit exceeded. Please try again later."
        : `GitHub API error: ${response.status}`;
    throw new GitHubApiError(response.status, message);
  }
  return response.json();
}

export async function searchRepositories(
  query: string,
  page: number = 1,
  perPage: number = 10,
  sort: string = "stars",
  order: string = "desc",
): Promise<GitHubSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
    sort,
    order,
  });

  const response = await fetch(`${BASE_URL}/search/repositories?${params}`, {
    headers,
  });
  return handleResponse<GitHubSearchResponse>(response);
}

export async function getRepository(
  owner: string,
  repo: string,
): Promise<GitHubRepository> {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}`, {
    headers,
  });
  return handleResponse<GitHubRepository>(response);
}

export async function getContributors(
  owner: string,
  repo: string,
): Promise<GitHubContributor[]> {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/contributors?per_page=10`,
    { headers },
  );
  return handleResponse<GitHubContributor[]>(response);
}

export async function getIssues(
  owner: string,
  repo: string,
): Promise<GitHubIssue[]> {
  const response = await fetch(
    `${BASE_URL}/repos/${owner}/${repo}/issues?state=open&per_page=5`,
    { headers },
  );
  return handleResponse<GitHubIssue[]>(response);
}

export async function getReadme(owner: string, repo: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/readme`, {
    headers,
  });
  const data = await handleResponse<{ content: string }>(response);
  return atob(data.content);
}

export async function getRepositoryDetails(
  owner: string,
  repo: string,
): Promise<RepositoryDetails> {
  const [repository, contributors, issues] = await Promise.all([
    getRepository(owner, repo),
    getContributors(owner, repo),
    getIssues(owner, repo),
  ]);

  return {
    ...repository,
    contributors,
    open_issues: issues,
  };
}
