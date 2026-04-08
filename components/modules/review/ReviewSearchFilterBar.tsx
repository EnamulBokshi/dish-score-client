"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ReviewFilterValue = "most-recent" | "top-rated" | "lowest-rated";
export type ReviewLimitValue = "9" | "12" | "18" | "24";
export type ReviewRatingValue = "all" | "5" | "4" | "3" | "2" | "1";

interface ReviewSearchFilterBarProps {
  defaultSearchTerm: string;
  defaultFilter: ReviewFilterValue;
  defaultLimit: ReviewLimitValue;
  defaultRating: ReviewRatingValue;
  defaultCreatedAt?: string;
}

export default function ReviewSearchFilterBar({
  defaultSearchTerm,
  defaultFilter,
  defaultLimit,
  defaultRating,
  defaultCreatedAt = "",
}: ReviewSearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [filter, setFilter] = useState<ReviewFilterValue>(defaultFilter);
  const [limit, setLimit] = useState<ReviewLimitValue>(defaultLimit);
  const [rating, setRating] = useState<ReviewRatingValue>(defaultRating);
  const [createdAt, setCreatedAt] = useState(defaultCreatedAt);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(defaultSearchTerm);

  function applyFilters(
    nextSearch: string,
    nextFilter: ReviewFilterValue,
    nextLimit: ReviewLimitValue,
    nextRating: ReviewRatingValue,
    nextCreatedAt: string,
    mode: "push" | "replace" = "replace",
  ) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("searchTerm", nextSearch.trim());
    }

    if (nextRating !== "all") {
      params.set("rating", nextRating);
    }

    if (nextCreatedAt.trim()) {
      params.set("createdAt", nextCreatedAt.trim());
    }

    params.set("filter", nextFilter);
    params.set("limit", nextLimit);
    params.set("page", "1");

    const targetUrl = `${pathname}?${params.toString()}`;

    if (mode === "push") {
      router.push(targetUrl);
      return;
    }

    router.replace(targetUrl);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    applyFilters(debouncedSearchTerm, filter, limit, rating, createdAt, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  function handleFilterChange(nextFilter: ReviewFilterValue) {
    setFilter(nextFilter);
    applyFilters(searchTerm, nextFilter, limit, rating, createdAt, "replace");
  }

  function handleRatingChange(nextRating: ReviewRatingValue) {
    setRating(nextRating);
    applyFilters(searchTerm, filter, limit, nextRating, createdAt, "replace");
  }

  function handleLimitChange(nextLimit: ReviewLimitValue) {
    setLimit(nextLimit);
    applyFilters(searchTerm, filter, nextLimit, rating, createdAt, "replace");
  }

  function handleCreatedAtChange(nextCreatedAt: string) {
    setCreatedAt(nextCreatedAt);
    applyFilters(searchTerm, filter, limit, rating, nextCreatedAt, "replace");
  }

  function handleReset() {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setFilter("most-recent");
    setLimit("12");
    setRating("all");
    setCreatedAt("");
    router.push(pathname);
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_1fr_auto] xl:items-end">
      <div className="space-y-1.5">
        <label
          htmlFor="review-search"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]"
        >
          Search Reviews
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b58d7f] dark:text-[#c9b2a7]" />
          <Input
            id="review-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Dish, restaurant, or reviewer"
            className="h-10 border-[#efddd5] bg-[#fff9f6] pl-8 text-[#5d4b45] placeholder:text-[#b48f82] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0] dark:placeholder:text-[#9f948e]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]">Sort By</p>
        <Select value={filter} onValueChange={(value) => handleFilterChange(value as ReviewFilterValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-recent">Most Recent</SelectItem>
            <SelectItem value="top-rated">Top Rated</SelectItem>
            <SelectItem value="lowest-rated">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]">Min Rating</p>
        <Select value={rating} onValueChange={(value) => handleRatingChange(value as ReviewRatingValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
            <SelectItem value="4">4 stars+</SelectItem>
            <SelectItem value="3">3 stars+</SelectItem>
            <SelectItem value="2">2 stars+</SelectItem>
            <SelectItem value="1">1 star+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]">Per Page</p>
        <Select value={limit} onValueChange={(value) => handleLimitChange(value as ReviewLimitValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0]">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="24">24</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]" htmlFor="review-filter-created-at">
          Created At
        </label>
        <Input
          id="review-filter-created-at"
          type="date"
          value={createdAt}
          onChange={(event) => handleCreatedAtChange(event.target.value)}
          className="h-10 border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0]"
        />
      </div>

      <Button
        type="button"
        onClick={handleReset}
        className="h-10 rounded-full border border-[#ffbeaa] bg-white px-4 text-[#8f5141] hover:bg-[#fff4ee] md:mt-0 dark:border-white/15 dark:bg-[#1d212c] dark:text-[#e5cec3] dark:hover:bg-[#252b38]"
      >
        <X className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
