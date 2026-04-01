import {
  Star,
  GitFork,
  ExternalLink,
  Calendar,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GitHubRepository } from "@/types/github";
import {formatDate} from "@/helper";

interface RepositoryCardProps {
  repository: GitHubRepository;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function RepositoryCard({
  repository,
  isFavorite,
  onToggleFavorite,
}: RepositoryCardProps) {


  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repository.name}
            </a>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className="shrink-0"
          >
            {isFavorite ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription className="line-clamp-2">
          {repository.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {repository.topics.slice(0, 5).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {repository.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {repository.forks_count.toLocaleString()}
          </span>
          {repository.language && (
            <Badge variant="outline" className="text-xs">
              {repository.language}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Updated {formatDate(repository.updated_at)}
          </span>
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
          >
            <Button variant="ghost" size="sm" className="gap-1">
              View <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
