import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import {
  searchRepositories,
  getRepository,
  getContributors,
  getIssues,
  getRepositoryDetails,
} from "@/services/github";
import { server } from "./mocks/github";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("GitHub API Service", () => {
  describe("searchRepositories", () => {
    it("should return search results", async () => {
      const result = await searchRepositories("react");

      expect(result.total_count).toBe(2);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("react");
      expect(result.items[0].owner.login).toBe("facebook");
    });

    it("should accept pagination parameters", async () => {
      const result = await searchRepositories("react", 2, 20, "stars", "desc");

      expect(result).toBeDefined();
    });

    it("should handle API errors", async () => {
      await expect(searchRepositories("error")).rejects.toThrow(
        "GitHub API error: 500",
      );
    });

    it("should handle rate limiting", async () => {
      await expect(searchRepositories("rate-limited")).rejects.toThrow(
        "API rate limit exceeded",
      );
    });
  });

  describe("getRepository", () => {
    it("should return repository details", async () => {
      const result = await getRepository("facebook", "react");

      expect(result.id).toBe(1);
      expect(result.name).toBe("react");
      expect(result.full_name).toBe("facebook/react");
      expect(result.stargazers_count).toBe(215000);
    });

    it("should include owner information", async () => {
      const result = await getRepository("facebook", "react");

      expect(result.owner.login).toBe("facebook");
      expect(result.owner.avatar_url).toBeDefined();
    });

    it("should include repository metadata", async () => {
      const result = await getRepository("facebook", "react");

      expect(result.language).toBe("JavaScript");
      expect(result.topics).toContain("react");
      expect(result.forks_count).toBe(46000);
    });
  });

  describe("getContributors", () => {
    it("should return list of contributors", async () => {
      const result = await getContributors("facebook", "react");

      expect(result).toHaveLength(2);
      expect(result[0].login).toBe("gaearon");
      expect(result[0].contributions).toBe(1000);
    });

    it("should include contributor avatars", async () => {
      const result = await getContributors("facebook", "react");

      expect(result[0].avatar_url).toBeDefined();
    });
  });

  describe("getIssues", () => {
    it("should return list of open issues", async () => {
      const result = await getIssues("facebook", "react");

      expect(result).toHaveLength(2);
      expect(result[0].state).toBe("open");
      expect(result[0].title).toBe("Bug: Component not rendering");
    });

    it("should include issue numbers", async () => {
      const result = await getIssues("facebook", "react");

      expect(result[0].number).toBe(123);
    });
  });

  describe("getRepositoryDetails", () => {
    it("should return combined repository data", async () => {
      const result = await getRepositoryDetails("facebook", "react");

      expect(result.id).toBe(1);
      expect(result.contributors).toHaveLength(2);
      expect(result.open_issues).toHaveLength(2);
    });

    it("should include repository, contributors, and issues", async () => {
      const result = await getRepositoryDetails("facebook", "react");

      expect(result.name).toBe("react");
      expect(result.contributors[0].login).toBe("gaearon");
      expect(result.open_issues[0].title).toBeDefined();
    });
  });
});
