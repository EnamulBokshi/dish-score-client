import Link from "next/link";
import { ArrowLeft, CalendarDays, DollarSign, Store } from "lucide-react";
import { notFound } from "next/navigation";

import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import MenuReviewCard from "@/components/modules/review/MenuReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDishById } from "@/services/dish.services";

interface AdminDishDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    reviewsPage?: string;
    reviewsLimit?: string;
    reviewSearch?: string;
  }>;
}

const TONE_SEQUENCE: Array<"rose" | "orange" | "gold" | "mint"> = [
  "rose",
  "orange",
  "gold",
  "mint",
];

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.floor(parsed);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatDateLabel(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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

function normalizeSearch(value?: string): string {
  return (value || "").trim().toLowerCase();
}

function buildParamsObject(input: {
  reviewsPage: number;
  reviewsLimit: number;
  reviewSearch?: string;
}) {
  const params = new URLSearchParams();
  params.set("reviewsPage", String(input.reviewsPage));
  params.set("reviewsLimit", String(input.reviewsLimit));
  if (input.reviewSearch?.trim()) {
    params.set("reviewSearch", input.reviewSearch.trim());
  }
  return params.toString();
}

export default async function AdminDishDetailsPage({
  params,
  searchParams,
}: AdminDishDetailsPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  const reviewSearch = query.reviewSearch?.trim() || "";
  const normalizedReviewSearch = normalizeSearch(query.reviewSearch);
  const allReviews = dish.reviews ?? [];

  const filteredReviews = normalizedReviewSearch
    ? allReviews.filter((review) => {
        const haystacks = [review.user?.name, review.comment, String(review.rating)]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystacks.includes(normalizedReviewSearch);
      })
    : allReviews;

  const requestedReviewsLimit = parsePositiveInt(query.reviewsLimit, 12);
  const reviewsLimit = clamp(requestedReviewsLimit, 6, 48);
  const totalReviewPages = Math.max(Math.ceil(filteredReviews.length / reviewsLimit), 1);
  const reviewsPage = clamp(parsePositiveInt(query.reviewsPage, 1), 1, totalReviewPages);

  const reviewsStart = (reviewsPage - 1) * reviewsLimit;
  const reviewsEnd = reviewsStart + reviewsLimit;
  const reviews = filteredReviews.slice(reviewsStart, reviewsEnd);

  const reviewsPrevQuery = buildParamsObject({
    reviewsPage: Math.max(reviewsPage - 1, 1),
    reviewsLimit,
    reviewSearch,
  });

  const reviewsNextQuery = buildParamsObject({
    reviewsPage: Math.min(reviewsPage + 1, totalReviewPages),
    reviewsLimit,
    reviewSearch,
  });

  const clearReviewSearchQuery = buildParamsObject({
    reviewsPage: 1,
    reviewsLimit,
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Dish Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deep details view for admin moderation and quality checks.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/dashboard/dishes" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dishes
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dish.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {reviewSearch ? (
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">Active Filters</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-2">
                  Review: {reviewSearch}
                  <Link href={`?${clearReviewSearchQuery}`} className="underline underline-offset-2">
                    Clear
                  </Link>
                </Badge>
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Price</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-semibold">
                <DollarSign className="h-4 w-4" />
                {typeof dish.price === "number" ? dish.price.toFixed(2) : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Rating</p>
              <p className="mt-1 font-semibold">{Number(dish.ratingAvg || 0).toFixed(1)}/5</p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Total Reviews</p>
              <p className="mt-1 font-semibold">{dish.totalReviews || 0}</p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Created</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-semibold">
                <CalendarDays className="h-4 w-4" />
                {formatDateLabel(dish.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background/50 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Restaurant</p>
            <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-foreground">
              <Store className="h-4 w-4" />
              {dish.restaurant?.name || "Unknown restaurant"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Description</p>
            <p className="mt-1 text-foreground">{dish.description || "-"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {dish.tags?.length ? (
                dish.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No tags</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Ingredients</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {dish.ingredients?.length ? (
                dish.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary">
                    {ingredient}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No ingredients listed</p>
              )}
            </div>
          </div>

          {dish.image ? (
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Image</p>
              <img
                src={resolveMediaUrl(dish.image) || dish.image}
                alt={dish.name}
                className="mt-2 h-28 w-28 rounded-md border border-border object-cover"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews ({filteredReviews.length}/{allReviews.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <form method="get" className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="reviewsPage" value="1" />
            <input type="hidden" name="reviewsLimit" value={String(reviewsLimit)} />
            <input
              type="text"
              name="reviewSearch"
              defaultValue={reviewSearch}
              placeholder="Search reviews by user name, comment, rating"
              className="h-9 min-w-80 rounded-md border border-input bg-background px-3 text-sm"
            />
            <Button type="submit" size="sm">Search</Button>
            {reviewSearch ? (
              <Button asChild type="button" size="sm" variant="outline">
                <Link href={`?${clearReviewSearchQuery}`}>Clear</Link>
              </Button>
            ) : null}
          </form>

          {reviews.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {reviews.map((review, index) => (
                <div key={review.id} className="origin-top sm:scale-95">
                  <MenuReviewCard
                    id={review.id}
                    dishName={dish.name}
                    restaurantName={dish.restaurant?.name || "Restaurant"}
                    reviewerName={review.user?.name || "Anonymous"}
                    rating={review.rating}
                    likes={0}
                    isLoggedIn={false}
                    comment={review.comment}
                    imageUrl={resolveMediaUrl(dish.image) || dish.image || null}
                    createdAtLabel={formatReviewDate(review.createdAt)}
                    tone={TONE_SEQUENCE[index % TONE_SEQUENCE.length]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews found.</p>
          )}

          {totalReviewPages > 1 ? (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                Page {reviewsPage} of {totalReviewPages}
              </p>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" disabled={reviewsPage <= 1}>
                  <Link href={`?${reviewsPrevQuery}`}>Previous</Link>
                </Button>
                <Button asChild variant="outline" size="sm" disabled={reviewsPage >= totalReviewPages}>
                  <Link href={`?${reviewsNextQuery}`}>Next</Link>
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
