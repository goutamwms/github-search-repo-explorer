import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import type { SortOption, SortOrder } from "@/types/github";

interface SearchBarProps {
  onSearch: (query: string, sort: SortOption, order: SortOrder) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("stars");
  const [order, setOrder] = useState<SortOrder>("desc");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), sort, order);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label="Search repositories"
        />
      </div>
      <Select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortOption)}
        options={[
          { label: "Stars", value: "stars" },
          { label: "Forks", value: "forks" },
          { label: "Last Updated", value: "updated" },
        ]}
        aria-label="Sort by"
      />
      <Select
        value={order}
        onChange={(e) => setOrder(e.target.value as SortOrder)}
        options={[
          { label: "Descending", value: "desc" },
          { label: "Ascending", value: "asc" },
        ]}
        aria-label="Sort order"
      />
      <Button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
