import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { usePagination } from "@/hooks";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function Pagination({
  totalItems,
  currentPage,
  perPage,
  onPageChange,
  onPerPageChange,
}: PaginationProps) {
  const { totalPages, canGoPrev, canGoNext, prevPage, nextPage } =
    usePagination({
      totalItems,
      initialPage: currentPage,
      perPage,
    });

  if (totalItems === 0) return null;

  const handlePrev = () => {
    prevPage();
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    nextPage();
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          aria-label="Items per page"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={30}>30 / page</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
