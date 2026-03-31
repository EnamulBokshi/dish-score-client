"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Search, Star, Utensils, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getGlobalSearchResults } from "@/services/search.client";
import {
  GlobalSearchDish,
  GlobalSearchRestaurant,
  GlobalSearchResults,
  GlobalSearchReview,
  SearchScope,
} from "@/types/search.types";

interface GlobalSearchModalProps {
  isHomePage?: boolean;
  variant?: "navbar" | "dashboard";
  enableShortcut?: boolean;
}

const SEARCH_SCOPES: Array<{ label: string; value: SearchScope }> = [
  { label: "All", value: "all" },
  { label: "Restaurants", value: "restaurants" },
  { label: "Dishes", value: "dishes" },
  { label: "Reviews", value: "reviews" },
];

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 700;

function formatPrice(value: number | null): string {
  if (typeof value !== "number") {
    return "Price N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function RestaurantResultCard({ item, onSelect }: { item: GlobalSearchRestaurant; onSelect: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/restaurants/${item.id}`}
        onClick={onSelect}
        className="group block rounded-xl border border-white/12 bg-black/35 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-orange/45 hover:bg-black/50"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-1 text-sm font-semibold text-white">{item.name}</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neon-gold">
            <Star className="h-3.5 w-3.5 fill-neon-gold text-neon-gold" />
            {item.ratingAvg?.toFixed(1) ?? "0.0"}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#b8b8c4]">
          {item.description || "No description available."}
        </p>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#9f9fae]">
          <MapPin className="h-3.5 w-3.5 text-neon-orange" />
          {[item.city, item.state].filter(Boolean).join(", ") || "Location unavailable"}
        </p>
      </Link>
    </motion.div>
  );
}

function DishResultCard({ item, onSelect }: { item: GlobalSearchDish; onSelect: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/dishes/${item.id}`}
        onClick={onSelect}
        className="group block rounded-xl border border-white/12 bg-black/35 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-gold/40 hover:bg-black/50"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-1 text-sm font-semibold text-white">{item.name}</p>
          <p className="text-xs font-medium text-neon-gold">{formatPrice(item.price)}</p>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-[#b8b8c4]">{item.restaurant?.name || "Unknown restaurant"}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#9f9fae]">
          {item.description || "No description available."}
        </p>
      </Link>
    </motion.div>
  );
}

function ReviewResultCard({ item, onSelect }: { item: GlobalSearchReview; onSelect: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/reviews/${item.id}`}
        onClick={onSelect}
        className="group block rounded-xl border border-white/12 bg-black/35 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-neon-pink/45 hover:bg-black/50"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-1 text-sm font-semibold text-white">{item.user?.name || "Anonymous"}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neon-gold">
            <Star className="h-3.5 w-3.5 fill-neon-gold text-neon-gold" />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#b8b8c4]">{item.comment || "No comment added."}</p>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-[#9f9fae]">
          <Utensils className="h-3.5 w-3.5 text-neon-orange" />
          {item.restaurant?.name || "Unknown restaurant"}
          {item.dish?.name ? ` - ${item.dish.name}` : ""}
        </p>
      </Link>
    </motion.div>
  );
}

export default function GlobalSearchModal({
  isHomePage = false,
  variant = "navbar",
  enableShortcut = false,
}: GlobalSearchModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [scope, setScope] = useState<SearchScope>("all");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setScope("all");
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!enableShortcut) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase() ?? "";
      const isEditable =
        tagName === "input" ||
        tagName === "textarea" ||
        target?.isContentEditable;

      if (isEditable) {
        return;
      }

      const key = typeof event.key === "string" ? event.key.toLowerCase() : "";
      const hasModifier = event.metaKey || event.ctrlKey;

      if (hasModifier && key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enableShortcut]);

  const { data, isFetching, isError, error } = useQuery<GlobalSearchResults>({
    queryKey: ["global-search", debouncedSearchTerm, scope],
    queryFn: () =>
      getGlobalSearchResults({
        searchTerm: debouncedSearchTerm,
        scope,
        page: 1,
        limit: 8,
        sortOrder: "desc",
      }),
    enabled: open && debouncedSearchTerm.length >= MIN_SEARCH_LENGTH,
    staleTime: 30 * 1000,
  });

  const sections = useMemo(() => {
    const result = data;

    if (!result) {
      return [] as Array<{ key: SearchScope; title: string; total: number; items: unknown[] }>;
    }

    if (scope === "restaurants") {
      return [{ key: "restaurants" as const, title: "Restaurants", total: result.restaurants.total, items: result.restaurants.data }];
    }

    if (scope === "dishes") {
      return [{ key: "dishes" as const, title: "Dishes", total: result.dishes.total, items: result.dishes.data }];
    }

    if (scope === "reviews") {
      return [{ key: "reviews" as const, title: "Reviews", total: result.reviews.total, items: result.reviews.data }];
    }

    return [
      { key: "restaurants" as const, title: "Restaurants", total: result.restaurants.total, items: result.restaurants.data },
      { key: "dishes" as const, title: "Dishes", total: result.dishes.total, items: result.dishes.data },
      { key: "reviews" as const, title: "Reviews", total: result.reviews.total, items: result.reviews.data },
    ];
  }, [data, scope]);

  const buttonClassName =
    variant === "dashboard"
      ? "inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      : isHomePage
        ? "inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-[#f2e8e2] transition-colors hover:bg-white/10 hover:text-white"
        : "inline-flex items-center gap-2 rounded-md border border-[#ddd0c9] bg-[#f6efea] px-3 py-2 text-sm font-medium text-[#5d4b43] transition-colors hover:bg-[#efe3dd] hover:text-[#a14f37]";

  const hasMeaningfulQuery = debouncedSearchTerm.length >= MIN_SEARCH_LENGTH;
  const hasResults = (data?.summary.total ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className={buttonClassName} aria-label="Open global search">
          <span className="inline-flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className={variant === "dashboard" ? "inline" : "hidden xl:inline"}>
              {variant === "dashboard" ? "Search restaurants, dishes, reviews..." : "Search"}
            </span>
          </span>
          {variant === "dashboard" ? <span className="text-xs text-muted-foreground/80">Ctrl/Cmd + K</span> : null}
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] overflow-hidden border border-white/12 bg-[#09070d]/96 p-0 text-white shadow-[0_26px_80px_-30px_rgba(0,0,0,0.9)] sm:max-w-3xl data-open:slide-in-from-bottom-4 data-closed:slide-out-to-bottom-3"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-neon-orange/15 to-transparent" />

        <DialogHeader className="relative border-b border-white/10 px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-lg font-semibold text-white">Global Search</DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="Close search modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a9a9b7]" />
              <Input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search restaurants, dishes, reviews, tags..."
                className="h-11 border-white/15 bg-black/30 pl-10 text-white placeholder:text-[#8d8d9a] focus-visible:ring-neon-orange/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {SEARCH_SCOPES.map((item) => {
                const active = item.value === scope;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setScope(item.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition-colors",
                      active
                        ? "border-neon-orange/55 bg-neon-orange/15 text-neon-gold"
                        : "border-white/18 bg-white/5 text-[#b8b8c4] hover:border-white/28 hover:text-white",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </DialogHeader>

        <div className="relative p-5 pt-4 sm:p-6">
          <AnimatePresence mode="wait">
            {!hasMeaningfulQuery ? (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-dashed border-white/20 bg-black/25 p-5 text-sm text-[#b6b6c3]"
              >
                Type at least {MIN_SEARCH_LENGTH} characters to begin searching. Results are debounced for {SEARCH_DEBOUNCE_MS}
                ms so you can finish your full query first.
              </motion.div>
            ) : isFetching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <p className="inline-flex items-center gap-2 text-sm text-[#b8b8c4]">
                  <Loader2 className="h-4 w-4 animate-spin text-neon-orange" />
                  Searching across restaurants, dishes, and reviews...
                </p>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-18 animate-pulse rounded-xl border border-white/10 bg-white/5" />
                  ))}
                </div>
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
              >
                {(error as Error)?.message || "Something went wrong while searching."}
              </motion.div>
            ) : !hasResults ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-white/12 bg-black/25 p-5 text-sm text-[#b6b6c3]"
              >
                No matches found for <span className="font-semibold text-neon-gold">&quot;{debouncedSearchTerm}&quot;</span>.
                Try broader keywords, tag names, or switch scope.
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-[#b8b8c4]">
                    Found <span className="font-semibold text-neon-gold">{data?.summary.total ?? 0}</span> results
                  </p>
                  <Badge className="border-neon-orange/35 bg-neon-orange/12 text-neon-gold">
                    Scope: {scope.toUpperCase()}
                  </Badge>
                </div>

                <ScrollArea className="h-[min(58vh,34rem)] pr-3">
                  <div className="space-y-5 pb-2">
                    {sections.map((section) => {
                      if (section.total === 0) {
                        return null;
                      }

                      return (
                        <section key={section.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9b9baa]">
                              {section.title}
                            </h3>
                            <span className="text-xs text-[#8f8f9c]">{section.total} total</span>
                          </div>

                          <div className="space-y-2">
                            {section.key === "restaurants" &&
                              (section.items as GlobalSearchRestaurant[])
                                .slice(0, scope === "all" ? 4 : 8)
                                .map((item) => (
                                  <RestaurantResultCard key={item.id} item={item} onSelect={() => setOpen(false)} />
                                ))}

                            {section.key === "dishes" &&
                              (section.items as GlobalSearchDish[])
                                .slice(0, scope === "all" ? 4 : 8)
                                .map((item) => (
                                  <DishResultCard key={item.id} item={item} onSelect={() => setOpen(false)} />
                                ))}

                            {section.key === "reviews" &&
                              (section.items as GlobalSearchReview[])
                                .slice(0, scope === "all" ? 4 : 8)
                                .map((item) => (
                                  <ReviewResultCard key={item.id} item={item} onSelect={() => setOpen(false)} />
                                ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
