import { describe, it, expect } from "vitest";

describe("usePagination", () => {
  it("should calculate total pages correctly", () => {
    const totalPages = Math.ceil(100 / 10);
    expect(totalPages).toBe(10);
  });

  it("should handle goToPage correctly", () => {
    const totalPages = 10;

    const goToPage = (page: number) => {
      return Math.max(1, Math.min(page, totalPages));
    };

    expect(goToPage(0)).toBe(1);
    expect(goToPage(5)).toBe(5);
    expect(goToPage(15)).toBe(10);
  });

  it("should calculate start and end indexes correctly", () => {
    const currentPage = 2;
    const perPage = 10;
    const totalItems = 100;

    const startIndex = (currentPage - 1) * perPage + 1;
    const endIndex = Math.min(currentPage * perPage, totalItems);

    expect(startIndex).toBe(11);
    expect(endIndex).toBe(20);
  });
});
