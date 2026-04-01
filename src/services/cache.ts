interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private memoryCache = new Map<string, CacheEntry<unknown>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    localStorage.setItem(
      `github_cache_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
        ttl,
      }),
    );
  }

  get<T>(key: string): T | null {
    const memoryEntry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    if (memoryEntry && this.isValid(memoryEntry)) {
      return memoryEntry.data;
    }

    const localEntry = localStorage.getItem(`github_cache_${key}`);
    if (localEntry) {
      const parsed = JSON.parse(localEntry) as CacheEntry<T>;
      if (this.isValid(parsed)) {
        this.memoryCache.set(key, parsed);
        return parsed.data;
      }
    }

    return null;
  }

  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  invalidate(key: string): void {
    this.memoryCache.delete(key);
    localStorage.removeItem(`github_cache_${key}`);
  }

  invalidatePattern(pattern: string): void {
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      this.memoryCache.delete(key);
      localStorage.removeItem(`github_cache_${key}`);
    });
  }

  clear(): void {
    this.memoryCache.clear();
    Object.keys(localStorage)
      .filter((key) => key.startsWith("github_cache_"))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const cacheService = new CacheService();
