import Link from "next/link";
import { ChevronRight, Flame, Sparkles, Star, ThumbsUp } from "lucide-react";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import DishSearchFilterBar, {
  DishFilterValue,
  DishLimitValue,
  DishRatingFilterValue,
} from "@/components/modules/dish/DishSearchFilterBar";
import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getDishes, getTrendingDishes } from "@/services/dish.services";
import { IDish } from "@/types/dish.types";

interface DishesPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

type SortConfig = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const FILTER_SORT_MAP: Record<DishFilterValue, SortConfig> = {
  "top-rated": { sortBy: "ratingAvg", sortOrder: "desc" },
  "most-reviewed": { sortBy: "totalReviews", sortOrder: "desc" },
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  "price-low": { sortBy: "price", sortOrder: "asc" },
  "price-high": { sortBy: "price", sortOrder: "desc" },
};

const TONE_SEQUENCE: Array<"rose" | "orange" | "gold" | "mint"> = [
  "rose",
  "orange",
  "gold",
  "mint",
];

function getFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toPositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function recommendationScore(dish: IDish): number {
  const rating = dish.ratingAvg ?? 0;
  const reviews = dish.totalReviews ?? 0;

  return rating * Math.log10(reviews + 10);
}

function getRestaurantLabel(dish: IDish): string {
  return dish.restaurant?.name || "Community Pick";
}

function buildPageHref({
  page,
  searchTerm,
  filter,
  limit,
  price,
  ratingAvg,
}: {
  page: number;
  searchTerm: string;
  filter: DishFilterValue;
  limit: DishLimitValue;
  price: string;
  ratingAvg: DishRatingFilterValue;
}): string {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  if (price.trim()) {
    params.set("price", price.trim());
  }

  if (ratingAvg !== "all") {
    params.set("ratingAvg", ratingAvg);
  }

  params.set("filter", filter);
  params.set("limit", limit);
  params.set("page", String(page));

  return `/dishes?${params.toString()}`;
}

function buildPaginationPages(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

function SectionTitle({
  eyebrow,
  title,
  titleAccent,
  description,
}: {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:gap-3">
      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffc7b6] bg-[#fff2eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#cf5e39]">
        <Sparkles className="h-3.5 w-3.5 text-[#f08f56]" />
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-tight font-extrabold text-[#2f2420] sm:text-4xl">
        {title} <span className="text-[#ef4c7d]">{titleAccent}</span>
      </h2>
      <p className="max-w-2xl text-sm text-[#7d6b63] sm:text-base">{description}</p>
    </div>
  );
}

function DishGrid({ dishes }: { dishes: IDish[] }) {
  if (dishes.length === 0) {
    return (
      <div className="rounded-3xl border border-[#f0ddd4] bg-white px-5 py-10 text-center text-[#8e7b72]">
        No dishes available right now.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish, index) => (
        <MenuDishCard
          key={dish.id}
          id={dish.id}
          name={dish.name}
          restaurantName={getRestaurantLabel(dish)}
          tags={dish.tags}
          ingredients={dish.ingredients}
          imageUrl={resolveMediaUrl(dish.image)}
          price={dish.price}
          rating={dish.ratingAvg}
          reviews={dish.totalReviews}
          badgeText={`#${index + 1}`}
          tone={TONE_SEQUENCE[index % TONE_SEQUENCE.length]}
        />
      ))}
    </div>
  );
}

export default async function DishesPage({ searchParams }: DishesPageProps) {
  const rawSearchParams = await searchParams;

  const defaultFilter: DishFilterValue = "top-rated";
  const filterParam = getFirst(rawSearchParams.filter) as
    | DishFilterValue
    | undefined;
  const activeFilter =
    filterParam && FILTER_SORT_MAP[filterParam] ? filterParam : defaultFilter;

  const limitParam = getFirst(rawSearchParams.limit) as
    | DishLimitValue
    | undefined;
  const activeLimit: DishLimitValue =
    limitParam && ["9", "12", "18", "24"].includes(limitParam)
      ? limitParam
      : "12";

  const currentPage = toPositiveInt(getFirst(rawSearchParams.page), 1);
  const searchTerm = getFirst(rawSearchParams.searchTerm) || "";
  const price = getFirst(rawSearchParams.price) || "";
  const ratingAvgParam = getFirst(rawSearchParams.ratingAvg);
  const activeRatingAvg: DishRatingFilterValue =
    ratingAvgParam && ["1", "2", "3", "4", "5"].includes(ratingAvgParam)
      ? (ratingAvgParam as DishRatingFilterValue)
      : "all";
  const sortConfig = FILTER_SORT_MAP[activeFilter];

  const allDishesQuery = new URLSearchParams();
  allDishesQuery.set("page", String(currentPage));
  allDishesQuery.set("limit", activeLimit);
  allDishesQuery.set("sortBy", sortConfig.sortBy);
  allDishesQuery.set("sortOrder", sortConfig.sortOrder);
  if (searchTerm.trim()) {
    allDishesQuery.set("searchTerm", searchTerm.trim());
  }

  if (price.trim()) {
    allDishesQuery.set("price", price.trim());
  }

  if (activeRatingAvg !== "all") {
    allDishesQuery.set("ratingAvg", activeRatingAvg);
  }

  const [trendingDishes, recentResponse, allDishesResponse, recommendedResponse] =
    await Promise.all([
      getTrendingDishes(),
      getDishes("limit=6&sortBy=createdAt&sortOrder=desc"),
      getDishes(allDishesQuery.toString()),
      getDishes("limit=60&sortBy=ratingAvg&sortOrder=desc"),
    ]);

  const heroDish = trendingDishes[0];
  const trendingCards: IDish[] = trendingDishes
    .slice(0, 6)
    .map((dish) => ({ ...dish, restaurant: dish.restaurant }));
  const recentDishes = (recentResponse.data || []).slice(0, 6);
  const allDishes = allDishesResponse.data || [];

  const recommendedDishes = [...(recommendedResponse.data || [])]
    .sort((left, right) => recommendationScore(right) - recommendationScore(left))
    .slice(0, 6);

  const totalPages = Math.max(1, allDishesResponse.meta?.totalPages || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginationPages = buildPaginationPages(safeCurrentPage, totalPages);

  return (
    <main className="min-h-screen bg-[#f3ebe6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[40px] border border-[#e4d8d1] bg-[#f9f6f3] px-5 pb-30 pt-8 sm:px-8 sm:pt-10 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(142,112,97,0.16),transparent_36%),radial-gradient(circle_at_84%_16%,rgba(190,160,144,0.18),transparent_38%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d6c8c0] bg-[#f3eeea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725f56]">
                <Flame className="h-3.5 w-3.5 text-[#8d7266]" />
                Dish Review Hub
              </p>

              <h1 className="max-w-xl text-4xl leading-tight font-extrabold text-[#2f2520] sm:text-5xl">
                Honest Dish & Restaurant
                <span className="block text-[#8d5f4f]">Reviews in One Place</span>
              </h1>

              <p className="max-w-lg text-sm leading-7 text-[#7b6a62] sm:text-base">
                Explore trending dishes, fresh community opinions, and high-confidence ratings.
                Tap any card to open full dish details and review context.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45]">
                  <Link href="#all-dishes">Explore Ratings</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee]"
                >
                  <Link href="#recommended-dishes" className="inline-flex items-center gap-2">
                    See Scoring Method <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md rounded-[34px] border border-[#e4d9d3] bg-white p-4 shadow-[0_28px_44px_-34px_rgba(82,64,56,0.45)]">
              <div className="overflow-hidden rounded-[28px] bg-[#f2ece8]">
                {heroDish?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(heroDish.image) || heroDish.image}
                    alt={heroDish.name}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-linear-to-br from-[#e8dfda] via-[#f0ebe7] to-[#e2d8d3] text-7xl font-bold text-[#64544e]">
                    {heroDish?.name?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {heroDish ? (
            <div className="absolute left-1/2 bottom-5 w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 rounded-3xl border border-[#ded2cb] bg-white/95 p-4 shadow-[0_22px_36px_-26px_rgba(84,67,59,0.46)] backdrop-blur transition-all duration-300 motion-safe:animate-slide-up hover:-translate-y-1 hover:border-[#cdb8ae] hover:shadow-[0_28px_46px_-24px_rgba(84,67,59,0.5)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8d6c61]">
                    #1 Trending Dish
                  </p>
                  <h2 className="text-2xl leading-tight font-bold text-[#2f2520]">
                    {heroDish.name}
                  </h2>
                  <p className="text-sm text-[#8e7a72]">
                    {heroDish.restaurant?.name || "Community Pick"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="inline-flex items-center gap-1 text-lg font-semibold text-[#87564a]">
                    <Star className="h-4 w-4 fill-[#f5bb2b] text-[#f5bb2b]" />
                    {heroDish.ratingAvg.toFixed(1)}
                  </p>
                  <p className="text-xs text-[#a18a80]">{heroDish.totalReviews} reviews</p>
                  <Button
                    asChild
                    className="mt-2 h-9 rounded-full bg-[#78635a] px-4 text-white hover:bg-[#68544c]"
                  >
                    <Link href={`/dishes/${heroDish.id}`}>Open Reviews</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[34px] border border-[#e4d7cf] bg-[#f8f4f1] p-5 sm:p-7">
          <SectionTitle
            eyebrow="Rating Momentum"
            title="Community"
            titleAccent="Trending"
            description="These are the dishes with the strongest current momentum from active community ratings."
          />

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#403732] px-3 py-1 text-xs font-semibold text-white">
              Most Rated
            </span>
            <span className="rounded-full border border-[#e4d7cf] bg-white px-3 py-1 text-xs font-medium text-[#7b6a63]">
              Most Discussed
            </span>
            <span className="rounded-full border border-[#e4d7cf] bg-white px-3 py-1 text-xs font-medium text-[#7b6a63]">
              Recently Reviewed
            </span>
            <span className="rounded-full border border-[#e4d7cf] bg-white px-3 py-1 text-xs font-medium text-[#7b6a63]">
              High Confidence
            </span>
          </div>

          <DishGrid dishes={trendingCards} />
        </section>

        <section className="rounded-[34px] border border-[#e5dad3] bg-white p-5 sm:p-7">
          <SectionTitle
            eyebrow="Recent Activity"
            title="Recent"
            titleAccent="Dishes"
            description="Recently listed dishes and fresh review activity from the community."
          />
          <DishGrid dishes={recentDishes} />
        </section>

        <section
          id="all-dishes"
          className="rounded-[34px] border border-[#e5dad3] bg-[#f8f4f1] p-5 sm:p-7"
        >
          <SectionTitle
            eyebrow="Dataset Explorer"
            title="All"
            titleAccent="Dishes"
            description="Filter by rating quality, review activity, or price context, and search by name."
          />

          <div className="mb-6 rounded-3xl border border-[#e5dad3] bg-white p-4 sm:p-5">
            <DishSearchFilterBar
              defaultSearchTerm={searchTerm}
              defaultFilter={activeFilter}
              defaultLimit={activeLimit}
              defaultPrice={price}
              defaultRatingAvg={activeRatingAvg}
            />
          </div>

          <DishGrid dishes={allDishes} />

          {totalPages > 1 ? (
            <div className="mt-6 rounded-2xl border border-[#e6dbd4] bg-white p-3 sm:p-4">
              <Pagination className="justify-end">
                <PaginationContent>
                  {safeCurrentPage > 1 ? (
                    <PaginationItem>
                      <PaginationPrevious
                        href={buildPageHref({
                          page: safeCurrentPage - 1,
                          searchTerm,
                          filter: activeFilter,
                          limit: activeLimit,
                          price,
                          ratingAvg: activeRatingAvg,
                        })}
                        className="rounded-full border border-[#e3d7d0] bg-[#f7f2ef] text-[#6f625d] hover:bg-[#eee7e2]"
                      />
                    </PaginationItem>
                  ) : null}

                  {paginationPages.map((page, index) => {
                    if (page === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={buildPageHref({
                            page,
                            searchTerm,
                            filter: activeFilter,
                            limit: activeLimit,
                            price,
                            ratingAvg: activeRatingAvg,
                          })}
                          isActive={page === safeCurrentPage}
                          className={
                            page === safeCurrentPage
                              ? "rounded-full border-[#cec1bb] bg-[#ece5e1] text-[#5f534f]"
                              : "rounded-full border border-[#e3d7d0] bg-[#f7f2ef] text-[#6f625d] hover:bg-[#eee7e2]"
                          }
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {safeCurrentPage < totalPages ? (
                    <PaginationItem>
                      <PaginationNext
                        href={buildPageHref({
                          page: safeCurrentPage + 1,
                          searchTerm,
                          filter: activeFilter,
                          limit: activeLimit,
                          price,
                          ratingAvg: activeRatingAvg,
                        })}
                        className="rounded-full border border-[#e3d7d0] bg-[#f7f2ef] text-[#6f625d] hover:bg-[#eee7e2]"
                      />
                    </PaginationItem>
                  ) : null}
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </section>

        <section
          id="recommended-dishes"
          className="rounded-[34px] border border-[#e5dad3] bg-white p-5 sm:p-7"
        >
          <SectionTitle
            eyebrow="High Confidence Picks"
            title="Recommended"
            titleAccent="Dishes"
            description="Ranked by a weighted recommendation score from rating quality and review volume."
          />

          <div className="mb-5 rounded-2xl border border-[#dfd3cc] bg-[#f7f2ef] px-4 py-3 text-sm text-[#6f615a]">
            <p className="inline-flex items-center gap-2 font-semibold text-[#6b5a53]">
              <ThumbsUp className="h-4 w-4" />
              Recommendation Formula
            </p>
            <p className="mt-1 text-xs sm:text-sm">
              score = rating x log10(reviews + 10)
            </p>
          </div>

          <DishGrid dishes={recommendedDishes} />
        </section>
      </div>
    </main>
  );
}
