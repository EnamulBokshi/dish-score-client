import Link from "next/link";
import { ChevronRight, MessageSquareText, Sparkles, Star, ThumbsUp } from "lucide-react";

import { resolveMediaUrls } from "@/components/modules/home/card-utils";
import MenuReviewCard from "@/components/modules/review/MenuReviewCard";
import ReviewSearchFilterBar, {
  ReviewFilterValue,
  ReviewLimitValue,
  ReviewRatingValue,
} from "@/components/modules/review/ReviewSearchFilterBar";
import UnifiedCreateReviewDialog from "@/components/modules/review/UnifiedCreateReviewDialog";
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
import { getUserInfo } from "@/services/auth.services";
import { getReviews } from "@/services/review.services";
import { UserRole } from "@/types/enums";
import { IReview } from "@/types/review.types";

interface ReviewsPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

type SortConfig = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const FILTER_SORT_MAP: Record<ReviewFilterValue, SortConfig> = {
  "most-recent": { sortBy: "createdAt", sortOrder: "desc" },
  "top-rated": { sortBy: "rating", sortOrder: "desc" },
  "lowest-rated": { sortBy: "rating", sortOrder: "asc" },
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

function toRatingFilter(value: string | undefined): ReviewRatingValue {
  if (!value) {
    return "all";
  }

  return ["1", "2", "3", "4", "5"].includes(value) ? (value as ReviewRatingValue) : "all";
}

function formatReviewDate(isoDate?: string): string {
  if (!isoDate) {
    return "Recently";
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function recommendationScore(review: IReview): number {
  const rating = Number.isFinite(review.rating) ? review.rating : 0;
  const likes = review.likes?.length ?? 0;

  return rating * Math.log10(likes + 10);
}

function buildPageHref({
  page,
  searchTerm,
  filter,
  limit,
  rating,
  createdAt,
}: {
  page: number;
  searchTerm: string;
  filter: ReviewFilterValue;
  limit: ReviewLimitValue;
  rating: ReviewRatingValue;
  createdAt: string;
}): string {
  const params = new URLSearchParams();

  if (searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }

  if (rating !== "all") {
    params.set("rating", rating);
  }

  if (createdAt.trim()) {
    params.set("createdAt", createdAt.trim());
  }

  params.set("filter", filter);
  params.set("limit", limit);
  params.set("page", String(page));

  return `/reviews?${params.toString()}`;
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

function ReviewsGrid({ reviews, currentUserId }: { reviews: IReview[]; currentUserId?: string }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-[#f0ddd4] bg-white px-5 py-10 text-center text-[#8e7b72] dark:border-white/12 dark:bg-[#12131a] dark:text-[#b8aba4]">
        No reviews available right now.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => {
        const images = resolveMediaUrls(review.images);

        return (
          <MenuReviewCard
            key={review.id}
            id={review.id}
            dishName={review.dish?.name || "Unknown dish"}
            restaurantName={review.restaurant?.name || "Unknown restaurant"}
            reviewerName={review.user?.name || "Anonymous"}
            tags={review.tags}
            rating={review.rating}
            likes={review.likes?.length ?? 0}
            isLikedByCurrentUser={Boolean(
              currentUserId && review.likes?.some((like) => like.userId === currentUserId),
            )}
            isLoggedIn={Boolean(currentUserId)}
            comment={review.comment}
            imageUrl={images[0]}
            createdAtLabel={formatReviewDate(review.createdAt)}
            tone={TONE_SEQUENCE[index % TONE_SEQUENCE.length]}
          />
        );
      })}
    </div>
  );
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const rawSearchParams = await searchParams;

  const defaultFilter: ReviewFilterValue = "most-recent";
  const filterParam = getFirst(rawSearchParams.filter) as ReviewFilterValue | undefined;
  const activeFilter = filterParam && FILTER_SORT_MAP[filterParam] ? filterParam : defaultFilter;

  const limitParam = getFirst(rawSearchParams.limit) as ReviewLimitValue | undefined;
  const activeLimit: ReviewLimitValue =
    limitParam && ["9", "12", "18", "24"].includes(limitParam)
      ? limitParam
      : "12";

  const currentPage = toPositiveInt(getFirst(rawSearchParams.page), 1);
  const searchTerm = getFirst(rawSearchParams.searchTerm) || "";
  const activeRating = toRatingFilter(getFirst(rawSearchParams.rating));
  const activeCreatedAt = getFirst(rawSearchParams.createdAt) || "";
  const sortConfig = FILTER_SORT_MAP[activeFilter];

  const allReviewsQuery = new URLSearchParams();
  allReviewsQuery.set("page", String(currentPage));
  allReviewsQuery.set("limit", activeLimit);
  allReviewsQuery.set("sortBy", sortConfig.sortBy);
  allReviewsQuery.set("sortOrder", sortConfig.sortOrder);

  if (searchTerm.trim()) {
    allReviewsQuery.set("searchTerm", searchTerm.trim());
  }

  if (activeRating !== "all") {
    allReviewsQuery.set("rating", activeRating);
  }

  if (activeCreatedAt.trim()) {
    allReviewsQuery.set("createdAt", activeCreatedAt.trim());
  }

  const [spotlightResponse, recentResponse, allReviewsResponse, recommendedResponse, currentUser] = await Promise.all([
    getReviews("limit=1&sortBy=rating&sortOrder=desc"),
    getReviews("limit=6&sortBy=createdAt&sortOrder=desc"),
    getReviews(allReviewsQuery.toString()),
    getReviews("limit=60&sortBy=rating&sortOrder=desc"),
    getUserInfo(),
  ]);

  const heroReview = spotlightResponse.data?.[0];
  const recentReviews = (recentResponse.data || []).slice(0, 6);
  const allReviews = allReviewsResponse.data || [];
  const recommendedReviews = [...(recommendedResponse.data || [])]
    .sort((left, right) => recommendationScore(right) - recommendationScore(left))
    .slice(0, 6);

  const totalPages = Math.max(1, allReviewsResponse.meta?.totalPages || 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginationPages = buildPaginationPages(safeCurrentPage, totalPages);
  const currentUserId = typeof currentUser?.id === "string" ? currentUser.id : undefined;
  const currentUserRole =
    currentUser?.role && Object.values(UserRole).includes(currentUser.role as UserRole)
      ? (currentUser.role as UserRole)
      : undefined;

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
                <MessageSquareText className="h-3.5 w-3.5 text-[#8d7266] dark:text-[#f3a888]" />
                Review Intelligence Hub
              </p>

              <h1 className="max-w-xl text-4xl leading-tight font-extrabold text-[#2f2520] dark:text-[#f2ebe7] sm:text-5xl">
                Community Reviews
                <span className="block text-[#8d5f4f] dark:text-[#f0b099]">That Drive Decisions</span>
              </h1>

              <p className="max-w-lg text-sm leading-7 text-[#7b6a62] dark:text-[#b8aca6] sm:text-base">
                Explore authentic dish and restaurant feedback, compare rating confidence,
                and follow reviewer sentiment before you pick where to eat.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45] dark:bg-[#f08f56] dark:text-[#241711] dark:hover:bg-[#ff9f69]">
                  <Link href="#all-reviews">Explore Reviews</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-[#d8ccc5] bg-white px-5 text-[#665650] hover:bg-[#f6f1ee] dark:border-white/15 dark:bg-[#1b1d25] dark:text-[#d7cbc5] dark:hover:bg-[#242732]"
                >
                  <Link href="#recommended-reviews" className="inline-flex items-center gap-2">
                    See Ranking Logic <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md rounded-[34px] border border-[#e4d9d3] bg-white p-4 shadow-[0_28px_44px_-34px_rgba(82,64,56,0.45)] dark:border-white/12 dark:bg-[#141620] dark:shadow-[0_28px_44px_-34px_rgba(0,0,0,0.7)]">
              <div className="overflow-hidden rounded-[28px] bg-[#f2ece8] dark:bg-[#202430]">
                {heroReview?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrls(heroReview.images)[0] || heroReview.images[0]}
                    alt={heroReview.dish?.name || "Top review"}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-linear-to-br from-[#e8dfda] via-[#f0ebe7] to-[#e2d8d3] text-7xl font-bold text-[#64544e]">
                    {heroReview?.dish?.name?.charAt(0)?.toUpperCase() || "R"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {heroReview ? (
            <div className="absolute bottom-5 left-1/2 w-[calc(100%-2.5rem)] max-w-2xl -translate-x-1/2 rounded-3xl border border-[#ded2cb] bg-white/95 p-4 shadow-[0_22px_36px_-26px_rgba(84,67,59,0.46)] backdrop-blur transition-all duration-300 motion-safe:animate-slide-up hover:-translate-y-1 hover:border-[#cdb8ae] hover:shadow-[0_28px_46px_-24px_rgba(84,67,59,0.5)] dark:border-white/12 dark:bg-[#191b24]/95 dark:shadow-[0_22px_36px_-26px_rgba(0,0,0,0.7)] dark:hover:border-white/20 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8d6c61] dark:text-[#cdb6ac]">Top Rated Review</p>
                  <h2 className="text-2xl leading-tight font-bold text-[#2f2520] dark:text-[#f2ebe7]">
                    {heroReview.dish?.name || "Community Pick"}
                  </h2>
                  <p className="text-sm text-[#8e7a72] dark:text-[#b8aba5]">
                    {heroReview.restaurant?.name || "Unknown restaurant"} • by {heroReview.user?.name || "Anonymous"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="inline-flex items-center gap-1 text-lg font-semibold text-[#87564a] dark:text-[#f0b099]">
                    <Star className="h-4 w-4 fill-[#f5bb2b] text-[#f5bb2b]" />
                    {Number(heroReview.rating || 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-[#a18a80] dark:text-[#a9978f]">{heroReview.likes?.length ?? 0} helpful votes</p>
                  <Button asChild className="mt-2 h-9 rounded-full bg-[#78635a] px-4 text-white hover:bg-[#68544c] dark:bg-[#f08f56] dark:text-[#241711] dark:hover:bg-[#ff9f69]">
                    <Link href={`/reviews/${heroReview.id}`}>Open Review</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[34px] border border-[#e5dad3] bg-white p-5 dark:border-white/10 dark:bg-[#131722] sm:p-7">
          <SectionTitle
            eyebrow="Recent Signals"
            title="Latest"
            titleAccent="Reviews"
            description="Fresh feedback from diners who recently visited and shared their experience."
          />
          <ReviewsGrid reviews={recentReviews} currentUserId={currentUserId} />
        </section>

        <section id="all-reviews" className="rounded-[34px] border border-[#e5dad3] bg-[#f8f4f1] p-5 dark:border-white/10 dark:bg-[#151821] sm:p-7">
          <SectionTitle
            eyebrow="Review Explorer"
            title="All"
            titleAccent="Reviews"
            description="Search reviews, sort by recency or rating, and filter by minimum score."
          />

          <div className="mb-6 rounded-3xl border border-[#e5dad3] bg-white p-4 dark:border-white/12 dark:bg-[#161922] sm:p-5">
            <ReviewSearchFilterBar
              defaultSearchTerm={searchTerm}
              defaultFilter={activeFilter}
              defaultLimit={activeLimit}
              defaultRating={activeRating}
              defaultCreatedAt={activeCreatedAt}
            />
          </div>

          <ReviewsGrid reviews={allReviews} currentUserId={currentUserId} />

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
                          rating: activeRating,
                          createdAt: activeCreatedAt,
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
                            rating: activeRating,
                            createdAt: activeCreatedAt,
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
                          rating: activeRating,
                          createdAt: activeCreatedAt,
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
          id="recommended-reviews"
          className="rounded-[34px] border border-[#e5dad3] bg-white p-5 dark:border-white/10 dark:bg-[#131722] sm:p-7"
        >
          <SectionTitle
            eyebrow="High Confidence Insights"
            title="Recommended"
            titleAccent="Reviews"
            description="Ranked by a weighted score combining rating quality with community helpful votes."
          />

          <div className="mb-5 rounded-2xl border border-[#dfd3cc] bg-[#f7f2ef] px-4 py-3 text-sm text-[#6f615a] dark:border-white/12 dark:bg-[#1b1f2a] dark:text-[#b8aca6]">
            <p className="inline-flex items-center gap-2 font-semibold text-[#6b5a53] dark:text-[#e0d3cd]">
              <ThumbsUp className="h-4 w-4" />
              Ranking Formula
            </p>
            <p className="mt-1 text-xs sm:text-sm">score = rating x log10(helpfulVotes + 10)</p>
          </div>

          <ReviewsGrid reviews={recommendedReviews} currentUserId={currentUserId} />
        </section>
      </div>

      <UnifiedCreateReviewDialog userRole={currentUserRole} />
    </main>
  );
}
