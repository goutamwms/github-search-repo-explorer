import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/ui/loader";
import { useLocalStorage } from "@/hooks";
import type { GitHubRepository } from "@/types/github";

const RepositoryCard = lazy(() =>
  import("@/components/RepositoryCard").then((mod) => ({
    default: mod.RepositoryCard,
  })),
);

interface RepositoryListProps {
  repositories: GitHubRepository[];
  isLoading?: boolean;
}

export function RepositoryList({
  repositories,
  isLoading,
}: RepositoryListProps) {
  const [favorites, setFavorites] = useLocalStorage<GitHubRepository[]>(
    "favorites",
    [],
  );

  const toggleFavorite = (repo: GitHubRepository) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === repo.id);
      if (exists) {
        return prev.filter((f) => f.id !== repo.id);
      }
      return [...prev, repo];
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No repositories found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repositories.map((repo) => (
        <Suspense
          key={repo.id}
          fallback={<div className="h-64 rounded-lg bg-muted animate-pulse" />}
        >
          <RepositoryCard
            repository={repo}
            isFavorite={favorites.some((f) => f.id === repo.id)}
            onToggleFavorite={() => toggleFavorite(repo)}
          />
        </Suspense>
      ))}
    </div>
  );
}
