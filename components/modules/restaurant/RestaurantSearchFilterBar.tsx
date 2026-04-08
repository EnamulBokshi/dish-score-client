"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type RestaurantFilterValue = "top-rated" | "most-reviewed" | "newest" | "name-a-z" | "name-z-a";
export type RestaurantLimitValue = "9" | "12" | "18" | "24";

interface RestaurantSearchFilterBarProps {
  defaultSearchTerm: string;
  defaultFilter: RestaurantFilterValue;
  defaultLimit: RestaurantLimitValue;
}

export default function RestaurantSearchFilterBar({
  defaultSearchTerm,
  defaultFilter,
  defaultLimit,
}: RestaurantSearchFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [filter, setFilter] = useState<RestaurantFilterValue>(defaultFilter);
  const [limit, setLimit] = useState<RestaurantLimitValue>(defaultLimit);

  function submit(nextSearch: string, nextFilter: RestaurantFilterValue, nextLimit: RestaurantLimitValue) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("searchTerm", nextSearch.trim());
    }

    params.set("filter", nextFilter);
    params.set("limit", nextLimit);
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit(searchTerm, filter, limit);
  }

  function handleReset() {
    setSearchTerm("");
    setFilter("top-rated");
    setLimit("12");
    router.push(pathname);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-[1.7fr_1fr_1fr_auto_auto] md:items-end">
      <div className="space-y-1.5">
        <label
          htmlFor="restaurant-search"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]"
        >
          Search Restaurants
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#b58d7f] dark:text-[#c9b2a7]" />
          <Input
            id="restaurant-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by restaurant name"
            className="h-10 border-[#efddd5] bg-[#fff9f6] pl-8 text-[#5d4b45] placeholder:text-[#b48f82] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0] dark:placeholder:text-[#9f948e]"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]">Filter</p>
        <Select value={filter} onValueChange={(value) => setFilter(value as RestaurantFilterValue)}>
          <SelectTrigger className="h-10 w-full border-[#efddd5] bg-[#fff9f6] text-[#5d4b45] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#efe6e0]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top-rated">Top Rated</SelectItem>
            <SelectItem value="most-reviewed">Most Reviewed</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name-a-z">Name: A-Z</SelectItem>
            <SelectItem value="name-z-a">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9f7b6d] dark:text-[#cdb9af]">Per Page</p>
        <Select value={limit} onValueChange={(value) => setLimit(value as RestaurantLimitValue)}>
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
        className="h-10 rounded-full border border-[#ffbeaa] bg-white px-4 text-[#8f5141] hover:bg-[#fff4ee] md:mt-0 dark:border-white/15 dark:bg-[#1d212c] dark:text-[#e5cec3] dark:hover:bg-[#252b38]"
      >
        <X className="h-3.5 w-3.5" />
        Reset
      </Button>
    </form>
  );
}
