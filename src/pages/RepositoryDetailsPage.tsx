import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  PageLoader,
} from "@/components/ui";
import { getRepositoryDetails } from "@/services/github";
import { cacheService } from "@/services/cache";

export function RepositoryDetailsPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();

  const cacheKey = `repo_details_${owner}_${repo}`;
  const cachedData =
    cacheService.get<Awaited<ReturnType<typeof getRepositoryDetails>>>(
      cacheKey,
    );

  const { data, isLoading, error } = useQuery({
    queryKey: ["repository", owner, repo],
    queryFn: async () => {
      const result = await getRepositoryDetails(owner!, repo!);
      cacheService.set(cacheKey, result);
      return result;
    },
    enabled: !!owner && !!repo,
    staleTime: 5 * 60 * 1000,
    placeholderData: cachedData || undefined,
  });

  if (isLoading && !cachedData) {
    return <PageLoader />;
  }

  if (error || !data) {
    return (
      <div className="container py-8 px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to search
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Repository not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <Link to="/">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Button>
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl mb-2">{data.full_name}</CardTitle>
              <p className="text-muted-foreground">{data.description}</p>
            </div>
            <a href={data.html_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" /> View on GitHub
              </Button>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>{data.stargazers_count.toLocaleString()} stars</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4" />
              <span>{data.forks_count.toLocaleString()} forks</span>
            </div>
            {data.language && (
              <Badge variant="secondary">{data.language}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            {data.contributors.length === 0 ? (
              <p className="text-muted-foreground">No contributors found</p>
            ) : (
              <ul className="space-y-3">
                {data.contributors.map((contributor) => (
                  <li
                    key={contributor.login}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="h-8 w-8 rounded-full"
                    />
                    <a
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-sm font-medium"
                    >
                      {contributor.login}
                    </a>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {contributor.contributions} commits
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Issues ({data.open_issues.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.open_issues.length === 0 ? (
              <p className="text-muted-foreground">No open issues</p>
            ) : (
              <ul className="space-y-3">
                {data.open_issues.map((issue) => (
                  <li key={issue.id}>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:underline"
                    >
                      <span className="text-sm font-medium">
                        #{issue.number}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {issue.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
