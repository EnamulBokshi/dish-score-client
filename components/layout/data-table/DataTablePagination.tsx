import { cn } from "@/lib/utils";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export interface DataTablePaginationProps {
  state: PaginationState;
  pageCount: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPaginationChange: (state: PaginationState) => void;
}

export default function DataTablePagination({
  state,
  pageCount,
  totalItems,
  pageSizeOptions,
  onPaginationChange,
}: DataTablePaginationProps) {
  const currentPage = state.pageIndex + 1;
  const totalPages = Math.max(pageCount, 1);

  const normalizedPageSizeOptions = useMemo(() => {
    const baseOptions =
      pageSizeOptions && pageSizeOptions.length > 0
        ? pageSizeOptions
        : [1, 10, 20, 50, 100];

    return Array.from(
      new Set(baseOptions.filter((option) => Number.isFinite(option) && option > 0)),
    ).sort((a, b) => a - b);
  }, [pageSizeOptions]);

  const isCustomPageSize = !normalizedPageSizeOptions.includes(state.pageSize);

  const derivedPageSizeValue = isCustomPageSize
    ? "custom"
    : String(state.pageSize);

  const [pageSizeSelectValue, setPageSizeSelectValue] = useState<string | null>(
    null,
  );
  const [customPageSizeInput, setCustomPageSizeInput] = useState("10");

  useEffect(() => {
    setCustomPageSizeInput(String(state.pageSize));
    if (!isCustomPageSize) {
      setPageSizeSelectValue(null);
    }
  }, [state.pageSize, isCustomPageSize]);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Number of pages on each side of current page
    const maxPages = 5 + 2 * delta; // Maximum consecutive pages to show

    // Always add first page
    pages.push(1);

    // Determine the range around current page
    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);

    // Adjust range if we're near the start or end
    if (currentPage <= maxPages / 2) {
      right = Math.min(totalPages - 1, maxPages);
    }
    if (currentPage > totalPages - maxPages / 2) {
      left = Math.max(2, totalPages - maxPages + 1);
    }

    // Add ellipsis if there's a gap after first page
    if (left > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages in the range
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Add ellipsis if there's a gap before last page
    if (right < totalPages - 1) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Always add last page (if totalPages > 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    onPaginationChange({
      pageIndex: nextPage - 1,
      pageSize: state.pageSize,
    });
  };

  const applyCustomPageSize = () => {
    const parsed = Number(customPageSizeInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    onPaginationChange({
      pageIndex: 0,
      pageSize: Math.floor(parsed),
    });
    setPageSizeSelectValue("custom");
  };

  return (
    <div className="mt-4 w-full rounded-md border bg-muted/20 px-3 py-3">
      <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span> | Total
            records <span className="font-medium text-foreground">{totalItems}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Rows per page</span>
            <Select
              value={pageSizeSelectValue ?? derivedPageSizeValue}
              onValueChange={(value) => {
                if (value === "custom") {
                  setPageSizeSelectValue("custom");
                  return;
                }

                const selectedSize = Number(value);
                if (!Number.isNaN(selectedSize) && selectedSize > 0) {
                  setPageSizeSelectValue(null);
                  onPaginationChange({
                    pageIndex: 0,
                    pageSize: selectedSize,
                  });
                }
              }}
            >
              <SelectTrigger className="w-24" size="sm">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {normalizedPageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {(pageSizeSelectValue === "custom" || isCustomPageSize) && (
              <>
                <Input
                  type="number"
                  min={1}
                  value={customPageSizeInput}
                  onChange={(e) => setCustomPageSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCustomPageSize();
                    }
                  }}
                  className="h-8 w-24"
                  aria-label="Custom rows per page"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={applyCustomPageSize}
                >
                  Apply
                </Button>
              </>
            )}
          </div>
        </div>

        <Pagination className="mx-0 w-full justify-start xl:w-auto xl:justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                size="default"
                className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                aria-label="Go to first page"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(1);
                }}
              >
                First
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage - 1);
                }}
              />
            </PaginationItem>

            {visiblePages.map((page, index) =>
              page === -1 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page as number);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                className={cn(
                  currentPage >= totalPages && "pointer-events-none opacity-50",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(currentPage + 1);
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                size="default"
                className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
                aria-label="Go to last page"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(totalPages);
                }}
              >
                Last
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
