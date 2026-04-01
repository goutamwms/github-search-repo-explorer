import { useState, useCallback, useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  initialPage?: number;
  perPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  perPage: number;
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPerPage: (perPage: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export function usePagination({
  totalItems,
  initialPage = 1,
  perPage: initialPerPage = 10,
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPageState] = useState(initialPerPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / perPage);
  }, [totalItems, perPage]);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageState(newPerPage);
    setCurrentPage(1);
  }, []);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * perPage + 1;
  }, [currentPage, perPage]);

  const endIndex = useMemo(() => {
    return Math.min(currentPage * perPage, totalItems);
  }, [currentPage, perPage, totalItems]);

  return {
    currentPage,
    totalPages,
    perPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    setPerPage,
    canGoNext: currentPage < totalPages,
    canGoPrev: currentPage > 1,
  };
}
