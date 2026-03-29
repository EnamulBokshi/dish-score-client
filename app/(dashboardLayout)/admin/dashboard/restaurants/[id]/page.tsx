import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin, Star } from "lucide-react";
import { notFound } from "next/navigation";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import { resolveMediaUrl, resolveMediaUrls } from "@/components/modules/home/card-utils";
import MenuReviewCard from "@/components/modules/review/MenuReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRestaurantById } from "@/services/restaurant.services";

interface AdminRestaurantDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    dishesPage?: string;
    dishesLimit?: string;
    dishSearch?: string;
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

function formatDateLabel(value: string): string {
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

function buildParamsObject(input: {
  dishesPage: number;
  dishesLimit: number;
  dishSearch?: string;
  reviewsPage: number;
  reviewsLimit: number;
  reviewSearch?: string;
}) {
  const params = new URLSearchParams();
  params.set("dishesPage", String(input.dishesPage));
  params.set("dishesLimit", String(input.dishesLimit));
  if (input.dishSearch?.trim()) {
    params.set("dishSearch", input.dishSearch.trim());
  }
  params.set("reviewsPage", String(input.reviewsPage));
  params.set("reviewsLimit", String(input.reviewsLimit));
  if (input.reviewSearch?.trim()) {
    params.set("reviewSearch", input.reviewSearch.trim());
  }
  return params.toString();
}

function normalizeSearch(value?: string): string {
  return (value || "").trim().toLowerCase();
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

export default async function AdminRestaurantDetailsPage({
  params,
  searchParams,
}: AdminRestaurantDetailsPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const restaurant = await getRestaurantById(id);

  if (!restaurant) {
    notFound();
  }

  const allDishes = restaurant.dishes ?? [];
  const allReviews = restaurant.reviews ?? [];
  const dishSearch = query.dishSearch?.trim() || "";
  const reviewSearch = query.reviewSearch?.trim() || "";
  const normalizedDishSearch = normalizeSearch(query.dishSearch);
  const normalizedReviewSearch = normalizeSearch(query.reviewSearch);

  const filteredDishes = normalizedDishSearch
    ? allDishes.filter((dish) => {
        const haystacks = [
          dish.name,
          dish.description,
          ...(dish.tags ?? []),
          ...(dish.ingredients ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystacks.includes(normalizedDishSearch);
      })
    : allDishes;

  const filteredReviews = normalizedReviewSearch
    ? allReviews.filter((review) => {
        const haystacks = [
          review.user?.name,
          review.comment,
          String(review.rating),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystacks.includes(normalizedReviewSearch);
      })
    : allReviews;
  const restaurantImagePool = resolveMediaUrls(restaurant.images);

  const requestedDishesLimit = parsePositiveInt(query.dishesLimit, 10);
  const requestedReviewsLimit = parsePositiveInt(query.reviewsLimit, 10);

  const dishesLimit = clamp(requestedDishesLimit, 5, 50);
  const reviewsLimit = clamp(requestedReviewsLimit, 5, 50);

  const totalDishPages = Math.max(Math.ceil(filteredDishes.length / dishesLimit), 1);
  const totalReviewPages = Math.max(Math.ceil(filteredReviews.length / reviewsLimit), 1);

  const dishesPage = clamp(parsePositiveInt(query.dishesPage, 1), 1, totalDishPages);
  const reviewsPage = clamp(parsePositiveInt(query.reviewsPage, 1), 1, totalReviewPages);

  const dishesStart = (dishesPage - 1) * dishesLimit;
  const dishesEnd = dishesStart + dishesLimit;
  const reviewsStart = (reviewsPage - 1) * reviewsLimit;
  const reviewsEnd = reviewsStart + reviewsLimit;

  const dishes = filteredDishes.slice(dishesStart, dishesEnd);
  const reviews = filteredReviews.slice(reviewsStart, reviewsEnd);

  const dishesPrevQuery = buildParamsObject({
    dishesPage: Math.max(dishesPage - 1, 1),
    dishesLimit,
    dishSearch,
    reviewsPage,
    reviewsLimit,
    reviewSearch,
  });

  const dishesNextQuery = buildParamsObject({
    dishesPage: Math.min(dishesPage + 1, totalDishPages),
    dishesLimit,
    dishSearch,
    reviewsPage,
    reviewsLimit,
    reviewSearch,
  });

  const reviewsPrevQuery = buildParamsObject({
    dishesPage,
    dishesLimit,
    dishSearch,
    reviewsPage: Math.max(reviewsPage - 1, 1),
    reviewsLimit,
    reviewSearch,
  });

  const reviewsNextQuery = buildParamsObject({
    dishesPage,
    dishesLimit,
    dishSearch,
    reviewsPage: Math.min(reviewsPage + 1, totalReviewPages),
    reviewsLimit,
    reviewSearch,
  });

  const clearDishSearchQuery = buildParamsObject({
    dishesPage: 1,
    dishesLimit,
    reviewsPage,
    reviewsLimit,
    reviewSearch,
  });

  const clearReviewSearchQuery = buildParamsObject({
    dishesPage,
    dishesLimit,
    dishSearch,
    reviewsPage: 1,
    reviewsLimit,
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Restaurant Details</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deep details view for admin moderation and quality checks.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/dashboard/restaurants" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Restaurants
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{restaurant.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          {dishSearch || reviewSearch ? (
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">Active Filters</p>
              <div className="flex flex-wrap items-center gap-2">
                {dishSearch ? (
                  <Badge variant="secondary" className="gap-2">
                    Dish: {dishSearch}
                    <Link href={`?${clearDishSearchQuery}`} className="underline underline-offset-2">
                      Clear
                    </Link>
                  </Badge>
                ) : null}

                {reviewSearch ? (
                  <Badge variant="secondary" className="gap-2">
                    Review: {reviewSearch}
                    <Link href={`?${clearReviewSearchQuery}`} className="underline underline-offset-2">
                      Clear
                    </Link>
                  </Badge>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Rating</p>
              <p className="mt-1 inline-flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4" />
                {Number(restaurant.ratingAvg || 0).toFixed(1)}/5
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Total Reviews</p>
              <p className="mt-1 font-semibold">{restaurant.totalReviews}</p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Location</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-semibold">
                <MapPin className="h-4 w-4" />
                {restaurant.city}, {restaurant.state}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Created</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-semibold">
                <CalendarDays className="h-4 w-4" />
                {formatDateLabel(restaurant.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Address</p>
              <p className="mt-1 text-foreground">{restaurant.address}</p>
              <p className="text-muted-foreground">Road: {restaurant.road}</p>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Contact</p>
              <p className="mt-1 text-foreground">{restaurant.contact || "-"}</p>
              <p className="text-muted-foreground">
                Coordinates: {restaurant.location?.lat}, {restaurant.location?.lng}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Description</p>
            <p className="mt-1 text-foreground">{restaurant.description || "-"}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {restaurant.tags?.length ? (
                restaurant.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground">No tags</p>
              )}
            </div>
          </div>

          {restaurant.images?.length ? (
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Images</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {restaurant.images.map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`Restaurant image ${index + 1}`}
                    className="h-20 w-20 rounded-md border border-border object-cover"
                  />
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dishes ({filteredDishes.length}/{allDishes.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <form method="get" className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="dishesPage" value="1" />
            <input type="hidden" name="dishesLimit" value={String(dishesLimit)} />
            <input type="hidden" name="reviewsPage" value={String(reviewsPage)} />
            <input type="hidden" name="reviewsLimit" value={String(reviewsLimit)} />
            {reviewSearch ? <input type="hidden" name="reviewSearch" value={reviewSearch} /> : null}
            <input
              type="text"
              name="dishSearch"
              defaultValue={dishSearch}
              placeholder="Search dishes by name, description, tag, ingredient"
              className="h-9 min-w-80 rounded-md border border-input bg-background px-3 text-sm"
            />
            <Button type="submit" size="sm">Search</Button>
            {dishSearch ? (
              <Button asChild type="button" size="sm" variant="outline">
                <Link href={`?${clearDishSearchQuery}`}>Clear</Link>
              </Button>
            ) : null}
          </form>

          {dishes.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dishes.map((dish, index) => (
                <div key={dish.id} className="origin-top sm:scale-95">
                  <MenuDishCard
                    id={dish.id}
                    name={dish.name}
                    restaurantName={restaurant.name}
                    tags={dish.tags}
                    ingredients={dish.ingredients}
                    imageUrl={resolveMediaUrl(dish.image)}
                    price={dish.price}
                    rating={restaurant.ratingAvg}
                    reviews={restaurant.totalReviews}
                    badgeText={`#${dishesStart + index + 1}`}
                    tone={TONE_SEQUENCE[index % TONE_SEQUENCE.length]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No dishes found.</p>
          )}

          {totalDishPages > 1 ? (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                Page {dishesPage} of {totalDishPages}
              </p>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" disabled={dishesPage <= 1}>
                  <Link href={`?${dishesPrevQuery}`}>Previous</Link>
                </Button>
                <Button asChild variant="outline" size="sm" disabled={dishesPage >= totalDishPages}>
                  <Link href={`?${dishesNextQuery}`}>Next</Link>
                </Button>
              </div>
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
            <input type="hidden" name="dishesPage" value={String(dishesPage)} />
            <input type="hidden" name="dishesLimit" value={String(dishesLimit)} />
            {dishSearch ? <input type="hidden" name="dishSearch" value={dishSearch} /> : null}
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
              {reviews.map((review, index) => {
                return (
                  <div key={review.id} className="origin-top sm:scale-95">
                    <MenuReviewCard
                      id={review.id}
                      dishName="Dish Review"
                      restaurantName={restaurant.name}
                      reviewerName={review.user?.name || "Anonymous"}
                      rating={review.rating}
                      likes={0}
                      isLoggedIn={false}
                      comment={review.comment}
                      imageUrl={restaurantImagePool[index % Math.max(restaurantImagePool.length, 1)] || null}
                      createdAtLabel={formatReviewDate(restaurant.createdAt)}
                      tone={TONE_SEQUENCE[index % TONE_SEQUENCE.length]}
                    />
                  </div>
                );
              })}
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
