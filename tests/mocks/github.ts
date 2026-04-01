import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import type {
  GitHubRepository,
  GitHubContributor,
  GitHubIssue,
} from "@/types/github";

const mockRepository: GitHubRepository = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  description: "React is a JavaScript library for building user interfaces.",
  html_url: "https://github.com/facebook/react",
  stargazers_count: 215000,
  forks_count: 46000,
  language: "JavaScript",
  updated_at: "2024-01-15T10:30:00Z",
  topics: ["react", "javascript", "ui"],
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
  },
};

const mockContributors: GitHubContributor[] = [
  {
    login: "gaearon",
    id: 1,
    avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4",
    contributions: 1000,
    html_url: "https://github.com/gaearon",
  },
  {
    login: "acdlite",
    id: 2,
    avatar_url: "https://avatars.githubusercontent.com/u/417976?v=4",
    contributions: 500,
    html_url: "https://github.com/acdlite",
  },
];

const mockIssues: GitHubIssue[] = [
  {
    id: 1,
    number: 123,
    title: "Bug: Component not rendering",
    state: "open",
    html_url: "https://github.com/facebook/react/issues/123",
    created_at: "2024-01-10T10:00:00Z",
    user: {
      login: "user1",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  },
  {
    id: 2,
    number: 124,
    title: "Feature: Add new hook",
    state: "open",
    html_url: "https://github.com/facebook/react/issues/124",
    created_at: "2024-01-11T10:00:00Z",
    user: {
      login: "user2",
      avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
    },
  },
];

const mockSearchResponse = {
  total_count: 2,
  incomplete_results: false,
  items: [mockRepository],
};

export const handlers = [
  http.get(
    "https://api.github.com/search/repositories",
    async ({ request }) => {
      await delay(100);
      const url = new URL(request.url);
      const query = url.searchParams.get("q");

      if (query === "error") {
        return HttpResponse.json({ message: "Server Error" }, { status: 500 });
      }

      if (query === "rate-limited") {
        return HttpResponse.json(
          { message: "API rate limit exceeded" },
          { status: 403 },
        );
      }

      return HttpResponse.json(mockSearchResponse);
    },
  ),

  http.get("https://api.github.com/repos/:owner/:repo", async () => {
    await delay(100);
    return HttpResponse.json(mockRepository);
  }),

  http.get(
    "https://api.github.com/repos/:owner/:repo/contributors",
    async () => {
      await delay(100);
      return HttpResponse.json(mockContributors);
    },
  ),

  http.get("https://api.github.com/repos/:owner/:repo/issues", async () => {
    await delay(100);
    return HttpResponse.json(mockIssues);
  }),

  http.get("https://api.github.com/repos/:owner/:repo/readme", async () => {
    await delay(100);
    return HttpResponse.json({ content: btoa("# Hello World") });
  }),
];

export const server = setupServer(...handlers);
