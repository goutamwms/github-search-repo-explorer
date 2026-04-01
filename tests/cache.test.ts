import { describe, it, expect, beforeEach } from "vitest";
import { cacheService } from "@/services/cache";

describe("CacheService", () => {
  beforeEach(() => {
    cacheService.clear();
  });

  it("should set and get cache", () => {
    cacheService.set("test-key", { foo: "bar" }, 1000);
    const result = cacheService.get<{ foo: string }>("test-key");

    expect(result).toEqual({ foo: "bar" });
  });

  it("should return null for non-existent key", () => {
    const result = cacheService.get("non-existent");
    expect(result).toBeNull();
  });

  it("should invalidate cache", () => {
    cacheService.set("test-key", { foo: "bar" });
    cacheService.invalidate("test-key");

    const result = cacheService.get("test-key");
    expect(result).toBeNull();
  });

  it("should invalidate pattern", () => {
    cacheService.set("search_repos_1", { data: 1 });
    cacheService.set("search_repos_2", { data: 2 });
    cacheService.set("other_key", { data: 3 });

    cacheService.invalidatePattern("search_repos");

    expect(cacheService.get("search_repos_1")).toBeNull();
    expect(cacheService.get("search_repos_2")).toBeNull();
    expect(cacheService.get("other_key")).toEqual({ data: 3 });
  });
});
