import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { RepositoryList } from "@/components";
import { useLocalStorage } from "@/hooks";
import type { GitHubRepository } from "@/types/github";

export function FavoritesPage() {
  const [favorites] = useLocalStorage<GitHubRepository[]>("favorites", []);

  return (
    <div className="container py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Your Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
          <p className-foreground mb-="text-muted4">
            No favorites yet
          </p>
          <Link to="/" className="text-primary hover:underline">
            Search for repositories
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {favorites.length}{" "}
            {favorites.length === 1 ? "repository" : "repositories"} saved
          </p>
          <RepositoryList repositories={favorites} />
        </>
      )}
    </div>
  );
}
