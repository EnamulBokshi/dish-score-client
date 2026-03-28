"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
  defaultRestaurantId?: string;
  defaultDishId?: string;
  defaultUserId?: string;
  defaultCreatedAt?: string;
}

export default function ReviewSearchFilterBar({
  defaultSearchTerm,
  defaultFilter,
  defaultLimit,
  defaultRating,
  defaultRestaurantId = "",
  defaultDishId = "",
  defaultUserId = "",
  defaultCreatedAt = "",
}: ReviewSearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [filter, setFilter] = useState<ReviewFilterValue>(defaultFilter);
  const [limit, setLimit] = useState<ReviewLimitValue>(defaultLimit);
  const [rating, setRating] = useState<ReviewRatingValue>(defaultRating);
  const [restaurantId, setRestaurantId] = useState(defaultRestaurantId);
  const [dishId, setDishId] = useState(defaultDishId);
  const [userId, setUserId] = useState(defaultUserId);
  const [createdAt, setCreatedAt] = useState(defaultCreatedAt);

  function submit(
    nextSearch: string,
    nextFilter: ReviewFilterValue,
    nextLimit: ReviewLimitValue,
    nextRating: ReviewRatingValue,
    nextRestaurantId: string,
    nextDishId: string,
    nextUserId: string,
    nextCreatedAt: string,
  ) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("searchTerm", nextSearch.trim());
    }

    if (nextRating !== "all") {
      params.set("rating", nextRating);
    }

    if (nextRestaurantId.trim()) {
      params.set("restaurantId", nextRestaurantId.trim());
    }

    if (nextDishId.trim()) {
      params.set("dishId", nextDishId.trim());
    }

    if (nextUserId.trim()) {
      params.set("userId", nextUserId.trim());
    }

    if (nextCreatedAt.trim()) {
      params.set("createdAt", nextCreatedAt.trim());
    }

    params.set("filter", nextFilter);
    params.set("limit", nextLimit);
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(searchTerm, filter, limit, rating, restaurantId, dishId, userId, createdAt);
  }

  function handleReset() {
    setSearchTerm("");
    setFilter("most-recent");
    setLimit("12");
    setRating("all");
    setRestaurantId("");
    setDishId("");
    setUserId("");
    setCreatedAt("");
    router.push(pathname);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_0.7fr_auto_auto] xl:items-end"
    >
      <div className="space-y-1.5">
        <label
          htmlFor="review-search"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]"
        >
          Search Reviews
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b58d7f]" />
          <Input
            id="review-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Dish, restaurant, or reviewer"
            className="h-10 border-[#efddd5] bg-[#fff9f6] pl-8 text-[#5d4b45] placeholder:text-[#b48f82]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]">Sort By</p>
        <Select value={filter} onValueChange={(value) => setFilter(value as ReviewFilterValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45]">
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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]">Min Rating</p>
        <Select value={rating} onValueChange={(value) => setRating(value as ReviewRatingValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45]">
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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]">Per Page</p>
        <Select value={limit} onValueChange={(value) => setLimit(value as ReviewLimitValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45]">
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
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]" htmlFor="review-filter-restaurant-id">
          Restaurant ID
        </label>
        <Input
          id="review-filter-restaurant-id"
          value={restaurantId}
          onChange={(event) => setRestaurantId(event.target.value)}
          placeholder="restaurant id"
          className="h-10 border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] placeholder:text-[#b48f82]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]" htmlFor="review-filter-dish-id">
          Dish ID
        </label>
        <Input
          id="review-filter-dish-id"
          value={dishId}
          onChange={(event) => setDishId(event.target.value)}
          placeholder="dish id"
          className="h-10 border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] placeholder:text-[#b48f82]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]" htmlFor="review-filter-user-id">
          User ID
        </label>
        <Input
          id="review-filter-user-id"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="user id"
          className="h-10 border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] placeholder:text-[#b48f82]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d]" htmlFor="review-filter-created-at">
          Created At
        </label>
        <Input
          id="review-filter-created-at"
          type="date"
          value={createdAt}
          onChange={(event) => setCreatedAt(event.target.value)}
          className="h-10 border-[#efddd5] bg-[#fff9f6] text-[#5d4b45]"
        />
      </div>

      <Button
        type="submit"
        className="h-10 rounded-full bg-[#f85f8b] px-4 text-white hover:bg-[#eb4678] md:mt-0"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Apply
      </Button>

      <Button
        type="button"
        onClick={handleReset}
        className="h-10 rounded-full border border-[#ffbeaa] bg-white px-4 text-[#8f5141] hover:bg-[#fff4ee] md:mt-0"
      >
        <X className="h-3.5 w-3.5" />
        Reset
      </Button>
    </form>
  );
}
