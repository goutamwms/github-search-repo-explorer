import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar, RepositoryList, Pagination } from "@/components";
import { searchRepositories } from "@/services/github";
import { cacheService } from "@/services/cache";
import type { GitHubRepository, SortOption, SortOrder } from "@/types/github";

const CACHE_KEY = "search_repos";

function getCacheKey(
  query: string,
  page: number,
  sort: SortOption,
  order: SortOrder,
) {
  return `${CACHE_KEY}_${query}_${page}_${sort}_${order}`;
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sort, setSort] = useState<SortOption>("stars");
  const [order, setOrder] = useState<SortOrder>("desc");

  const cacheKey = getCacheKey(searchQuery, page, sort, order);
  const cachedData = cacheService.get<{
    items: GitHubRepository[];
    total_count: number;
  }>(cacheKey);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", searchQuery, page, perPage, sort, order],
    queryFn: async () => {
      const result = await searchRepositories(
        searchQuery,
        page,
        perPage,
        sort,
        order,
      );
      cacheService.set(cacheKey, result);
      return result;
    },
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000,
    placeholderData: cachedData
      ? {
          items: cachedData.items,
          total_count: cachedData.total_count,
          incomplete_results: false,
        }
      : undefined,
  });

  const handleSearch = useCallback((q: string, s: SortOption, o: SortOrder) => {
    setSearchQuery(q);
    setSort(s);
    setOrder(o);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  }, []);

  return (
    <div className="container py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">GitHub Repository Explorer</h1>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-center">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      {searchQuery && (
        <div className="mb-4 text-sm text-muted-foreground">
          Found {data?.total_count?.toLocaleString() || 0} results for "
          {searchQuery}"
        </div>
      )}

      <RepositoryList
        repositories={data?.items || []}
        isLoading={isLoading && !cachedData}
      />

      {data && data.total_count > 0 && (
        <div className="mt-8">
          <Pagination
            totalItems={data.total_count}
            currentPage={page}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </div>
      )}
    </div>
  );
}
