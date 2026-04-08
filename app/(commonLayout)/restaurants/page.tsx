import Link from "next/link";
import { ChevronRight, MapPin, Sparkles, Star, Store, ThumbsUp } from "lucide-react";

import MenuRestaurantCard from "@/components/modules/restaurant/MenuRestaurantCard";
import RestaurantSearchFilterBar, {
  RestaurantFilterValue,
  RestaurantLimitValue,
} from "@/components/modules/restaurant/RestaurantSearchFilterBar";
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
import { getRestaurants, getTopRatedRestaurants } from "@/services/restaurant.services";
import { IRestaurant } from "@/types/restaurant.types";

interface RestaurantsPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

type SortConfig = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const FILTER_SORT_MAP: Record<RestaurantFilterValue, SortConfig> = {
  "top-rated": { sortBy: "ratingAvg", sortOrder: "desc" },
  "most-reviewed": { sortBy: "totalReviews", sortOrder: "desc" },
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  "name-a-z": { sortBy: "name", sortOrder: "asc" },
  "name-z-a": { sortBy: "name", sortOrder: "desc" },
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

function recommendationScore(restaurant: IRestaurant): number {
  const rating = restaurant.ratingAvg ?? 0;
  const reviews = restaurant.totalReviews ?? 0;

  return rating * Math.log10(reviews + 10);
}

function locationLabel(restaurant: IRestaurant): string {
  return [restaurant.city, restaurant.state].filter(Boolean).join(", ") || "Unknown location";
}

function contextLabel(restaurant: IRestaurant): string {
  if (restaurant.dishes && restaurant.dishes.length > 0) {
    return `Known for: ${restaurant.dishes[0].name}`;
  }

  return "Tap to view full review profile";
}

function buildPageHref({
  page,
  searchTerm,
  filter,
  limit,
}: {
  page: number;
  searchTerm: string;
  filter: RestaurantFilterValue;
  limit: RestaurantLimitValue;
}): string {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  params.set("filter", filter);
  params.set("limit", limit);
  params.set("page", String(page));

  return `/restaurants?${params.toString()}`;
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
      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffc7b6] bg-[#fff2eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#cf5e39] dark:border-[#6a4b43] dark:bg-[#2b1d1a] dark:text-[#ffb58f]">
        <Sparkles className="h-3.5 w-3.5 text-[#f08f56] dark:text-[#ffb58f]" />
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-tight font-extrabold text-[#2f2420] sm:text-4xl dark:text-[#f2ebe7]">
        {title} <span className="text-[#ef4c7d] dark:text-[#ff8cb1]">{titleAccent}</span>
      </h2>
      <p className="max-w-2xl text-sm text-[#7d6b63] sm:text-base dark:text-[#b8aca6]">{description}</p>
    </div>
  );
}

function RestaurantGrid({ restaurants }: { restaurants: IRestaurant[] }) {
  if (restaurants.length === 0) {
    return (
      <div className="rounded-3xl border border-[#f0ddd4] bg-white px-5 py-10 text-center text-[#8e7b72] dark:border-white/12 dark:bg-[#12131a] dark:text-[#b8aba4]">
        No restaurants available right now.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant, index) => (
        <MenuRestaurantCard
          key={restaurant.id}
          id={restaurant.id}
          name={restaurant.name}
          locationLabel={locationLabel(restaurant)}
          tags={restaurant.tags}
          imageUrl={resolveMediaUrl(restaurant.images?.[0])}
          rating={restaurant.ratingAvg}
          reviews={restaurant.totalReviews}
          badgeText={`#${index + 1}`}
          tone={TONE_SEQUENCE[index % TONE_SEQUENCE.length]}
          contextLabel={contextLabel(restaurant)}
        />
      ))}
    </div>
  );
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const rawSearchParams = await searchParams;

  const defaultFilter: RestaurantFilterValue = "top-rated";
  const filterParam = getFirst(rawSearchParams.filter) as RestaurantFilterValue | undefined;
  const activeFilter = filterParam && FILTER_SORT_MAP[filterParam] ? filterParam : defaultFilter;

  const limitParam = getFirst(rawSearchParams.limit) as RestaurantLimitValue | undefined;
  const activeLimit: RestaurantLimitValue =
    limitParam && ["9", "12", "18", "24"].includes(limitParam)
      ? limitParam
      : "12";

  const currentPage = toPositiveInt(getFirst(rawSearchParams.page), 1);
  const searchTerm = getFirst(rawSearchParams.searchTerm) || "";
  const sortConfig = FILTER_SORT_MAP[activeFilter];

  const allRestaurantsQuery = new URLSearchParams();
  allRestaurantsQuery.set("page", String(currentPage));
  allRestaurantsQuery.set("limit", activeLimit);
  allRestaurantsQuery.set("sortBy", sortConfig.sortBy);
  allRestaurantsQuery.set("sortOrder", sortConfig.sortOrder);
  if (searchTerm.trim()) {
    allRestaurantsQuery.set("searchTerm", searchTerm.trim());
  }

  const [topRatedRestaurants, recentResponse, allRestaurantsResponse, recommendedResponse] = await Promise.all([
    getTopRatedRestaurants(),
    getRestaurants("limit=6&sortBy=createdAt&sortOrder=desc"),
    getRestaurants(allRestaurantsQuery.toString()),
    getRestaurants("limit=60&sortBy=ratingAvg&sortOrder=desc"),
  ]);

  const heroRestaurant = topRatedRestaurants[0];
  const trendingCards: IRestaurant[] = topRatedRestaurants.slice(0, 6) as IRestaurant[];
  const recentRestaurants = (recentResponse.data || []).slice(0, 6);
  const allRestaurants = allRestaurantsResponse.data || [];
  const recommendedRestaurants = [...(recommendedResponse.data || [])]
    .sort((left, right) => recommendationScore(right) - recommendationScore(left))
    .slice(0, 6);

  const totalPages = Math.max(1, allRestaurantsResponse.meta?.totalPages || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginationPages = buildPaginationPages(safeCurrentPage, totalPages);

  return (
    <main className="min-h-screen bg-[#f3ebe6] px-4 py-8 dark:bg-[#0c0c12] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[40px] border border-[#e4d8d1] bg-[#f9f6f3] px-5 pb-30 pt-8 dark:border-white/10 dark:bg-[#13141c] sm:px-8 sm:pt-10 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_14%,rgba(142,112,97,0.16),transparent_36%),radial-gradient(circle_at_84%_16%,rgba(190,160,144,0.18),transparent_38%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#d6c8c0] bg-[#f3eeea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#725f56] dark:border-white/15 dark:bg-[#1c1e27] dark:text-[#d2c2ba]">
                <Store className="h-3.5 w-3.5 text-[#8d7266] dark:text-[#f3a888]" />
                Restaurant Review Hub
              </p>

              <h1 className="max-w-xl text-4xl leading-tight font-extrabold text-[#2f2520] dark:text-[#f2ebe7] sm:text-5xl">
                Trusted Restaurant
                <span className="block text-[#8d5f4f] dark:text-[#f0b099]">Profiles and Ratings</span>
              </h1>

              <p className="max-w-lg text-sm leading-7 text-[#7b6a62] dark:text-[#b8aca6] sm:text-base">
                Compare top restaurants, review momentum, and community confidence before choosing where to dine.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45] dark:bg-[#f08f56] dark:text-[#241711] dark:hover:bg-[#ff9f69]">
                  <Link href="#all-restaurants">Explore Ratings</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee] dark:border-white/15 dark:bg-[#1b1d25] dark:text-[#d7cbc5] dark:hover:bg-[#242732]"
                >
                  <Link href="#recommended-restaurants" className="inline-flex items-center gap-2">
                    See Scoring Method <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md rounded-[34px] border border-[#e4d9d3] bg-white p-4 shadow-[0_28px_44px_-34px_rgba(82,64,56,0.45)] dark:border-white/12 dark:bg-[#141620] dark:shadow-[0_28px_44px_-34px_rgba(0,0,0,0.7)]">
              <div className="overflow-hidden rounded-[28px] bg-[#f2ece8] dark:bg-[#202430]">
                {heroRestaurant?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(heroRestaurant.images[0]) || heroRestaurant.images[0]}
                    alt={heroRestaurant.name}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-linear-to-br from-[#e8dfda] via-[#f0ebe7] to-[#e2d8d3] text-7xl font-bold text-[#64544e]">
                    {heroRestaurant?.name?.charAt(0)?.toUpperCase() || "R"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {heroRestaurant ? (
            <div className="absolute bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 rounded-3xl border border-[#ded2cb] bg-white/95 p-4 shadow-[0_22px_36px_-26px_rgba(84,67,59,0.46)] backdrop-blur transition-all duration-300 motion-safe:animate-slide-up hover:-translate-y-1 hover:border-[#cdb8ae] hover:shadow-[0_28px_46px_-24px_rgba(84,67,59,0.5)] dark:border-white/12 dark:bg-[#191b24]/95 dark:shadow-[0_22px_36px_-26px_rgba(0,0,0,0.7)] dark:hover:border-white/20 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8d6c61] dark:text-[#cdb6ac]">#1 Top Rated Restaurant</p>
                  <h2 className="text-2xl leading-tight font-bold text-[#2f2520] dark:text-[#f2ebe7]">{heroRestaurant.name}</h2>
                  <p className="inline-flex items-center gap-1.5 text-sm text-[#8e7a72] dark:text-[#b8aba5]">
                    <MapPin className="h-3.5 w-3.5" />
                    {heroRestaurant.city}, {heroRestaurant.state}
                  </p>
                </div>

                <div className="text-right">
                  <p className="inline-flex items-center gap-1 text-lg font-semibold text-[#87564a] dark:text-[#f0b099]">
                    <Star className="h-4 w-4 fill-[#f5bb2b] text-[#f5bb2b]" />
                    {heroRestaurant.ratingAvg.toFixed(1)}
                  </p>
                  <p className="text-xs text-[#a18a80] dark:text-[#a9978f]">{heroRestaurant.totalReviews} reviews</p>
                  <Button asChild className="mt-2 h-9 rounded-full bg-[#78635a] px-4 text-white hover:bg-[#68544c] dark:bg-[#f08f56] dark:text-[#241711] dark:hover:bg-[#ff9f69]">
                    <Link href={`/restaurants/${heroRestaurant.id}`}>Open Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[34px] border border-[#e4d7cf] bg-[#f8f4f1] p-5 dark:border-white/10 dark:bg-[#151821] sm:p-7">
          <SectionTitle
            eyebrow="Rating Momentum"
            title="Community"
            titleAccent="Trending"
            description="Restaurants with the strongest momentum from active review volume and average rating."
          />
          <RestaurantGrid restaurants={trendingCards} />
        </section>

        <section className="rounded-[34px] border border-[#e5dad3] bg-white p-5 dark:border-white/10 dark:bg-[#131722] sm:p-7">
          <SectionTitle
            eyebrow="Recent Activity"
            title="Recently"
            titleAccent="Added"
            description="Newly listed restaurants and fresh review activity from the community."
          />
          <RestaurantGrid restaurants={recentRestaurants} />
        </section>

        <section id="all-restaurants" className="rounded-[34px] border border-[#e5dad3] bg-[#f8f4f1] p-5 dark:border-white/10 dark:bg-[#151821] sm:p-7">
          <SectionTitle
            eyebrow="Dataset Explorer"
            title="All"
            titleAccent="Restaurants"
            description="Filter by rating quality, review activity, alphabetical order, and search by name."
          />

          <div className="mb-6 rounded-3xl border border-[#e5dad3] bg-white p-4 dark:border-white/12 dark:bg-[#161922] sm:p-5">
            <RestaurantSearchFilterBar
              defaultSearchTerm={searchTerm}
              defaultFilter={activeFilter}
              defaultLimit={activeLimit}
            />
          </div>

          <RestaurantGrid restaurants={allRestaurants} />

          {totalPages > 1 ? (
            <div className="mt-6 rounded-2xl border border-[#e6dbd4] bg-white p-3 dark:border-white/12 dark:bg-[#161922] sm:p-4">
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
                        })}
                        className="rounded-full border border-[#e3d7d0] bg-[#f7f2ef] text-[#6f625d] hover:bg-[#eee7e2] dark:border-white/12 dark:bg-[#232733] dark:text-[#d0c4be] dark:hover:bg-[#2b3140]"
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
                          })}
                          isActive={page === safeCurrentPage}
                          className={
                            page === safeCurrentPage
                              ? "rounded-full border-[#cec1bb] bg-[#ece5e1] text-[#5f534f] dark:border-white/20 dark:bg-[#2b3140] dark:text-[#f0e7e2]"
                              : "rounded-full border border-[#e3d7d0] bg-[#f7f2ef] text-[#6f625d] hover:bg-[#eee7e2] dark:border-white/12 dark:bg-[#232733] dark:text-[#d0c4be] dark:hover:bg-[#2b3140]"
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
                        })}
                        className="rounded-full border border-[#e3d7d0] bg-[#f7f2ef] text-[#6f625d] hover:bg-[#eee7e2] dark:border-white/12 dark:bg-[#232733] dark:text-[#d0c4be] dark:hover:bg-[#2b3140]"
                      />
                    </PaginationItem>
                  ) : null}
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </section>

        <section
          id="recommended-restaurants"
          className="rounded-[34px] border border-[#e5dad3] bg-white p-5 dark:border-white/10 dark:bg-[#131722] sm:p-7"
        >
          <SectionTitle
            eyebrow="High Confidence Picks"
            title="Recommended"
            titleAccent="Restaurants"
            description="Ranked by a weighted recommendation score from rating quality and review volume."
          />

          <div className="mb-5 rounded-2xl border border-[#dfd3cc] bg-[#f7f2ef] px-4 py-3 text-sm text-[#6f615a] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#b8aca6]">
            <p className="inline-flex items-center gap-2 font-semibold text-[#6b5a53] dark:text-[#e0d3cd]">
              <ThumbsUp className="h-4 w-4" />
              Recommendation Formula
            </p>
            <p className="mt-1 text-xs sm:text-sm">score = rating x log10(reviews + 10)</p>
          </div>

          <RestaurantGrid restaurants={recommendedRestaurants} />
        </section>
      </div>
    </main>
  );
}
