export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  html_url: string;
  created_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface RepositoryDetails extends GitHubRepository {
  contributors: GitHubContributor[];
  open_issues: GitHubIssue[];
  readme?: string;
}

export type SortOption = "stars" | "forks" | "updated";
export type SortOrder = "asc" | "desc";

export interface SearchParams {
  query: string;
  page: number;
  perPage: number;
  sort: SortOption;
  order: SortOrder;
}
