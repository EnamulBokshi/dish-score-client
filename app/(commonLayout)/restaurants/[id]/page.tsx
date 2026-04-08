import Link from "next/link";
import { ArrowLeft, ChevronRight, MapPin, Phone, Star, Utensils } from "lucide-react";
import { notFound } from "next/navigation";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRestaurantById } from "@/services/restaurant.services";

interface RestaurantDetailsPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(value?: string): string {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocation(city?: string, state?: string): string {
  return [city, state].filter(Boolean).join(", ") || "Location unavailable";
}

function parseCoordinate(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidCoordinatePair(lat: number | null, lng: number | null): lat is number {
  if (lat === null || lng === null) {
    return false;
  }

  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export default async function RestaurantDetailsPage({ params }: RestaurantDetailsPageProps) {
  const { id } = await params;
  const restaurant = await getRestaurantById(id);

  if (!restaurant) {
    notFound();
  }

  const heroImage = resolveMediaUrl(restaurant.images?.[0]);
  const dishes = restaurant.dishes || [];
  const reviews = restaurant.reviews || [];
  const latitude = parseCoordinate(restaurant.location?.lat);
  const longitude = parseCoordinate(restaurant.location?.lng);
  const hasMappableLocation = isValidCoordinatePair(latitude, longitude);
  const mapEmbedUrl = hasMappableLocation
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=19&output=embed`
    : null;

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-22 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#f4fbf7] via-[#ecf8ef] to-[#f8fdf9] dark:from-[#07070b] dark:via-[#172009] dark:to-[#07070b]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-emerald-400/12 blur-3xl dark:bg-emerald-400/20"
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Button asChild variant="outline" className="border-[#b8dec6] bg-white text-[#276445] hover:bg-[#eaf7ef] dark:border-emerald-300/40 dark:bg-transparent dark:text-emerald-300 dark:hover:bg-emerald-300/10">
          <Link href="/restaurants" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Restaurants
          </Link>
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-[#cfe5d7] bg-[#f9fdfb]/96 shadow-[0_24px_50px_-36px_rgba(30,115,72,0.28)] backdrop-blur-sm dark:border-white/12 dark:bg-black/45 dark:shadow-[0_30px_75px_-42px_rgba(16,185,129,0.55)]">
          <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="overflow-hidden rounded-2xl border border-[#d3e6db] bg-[#eef9f1] dark:border-white/10 dark:bg-[#07100b]">
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt={restaurant.name}
                  className="h-full max-h-105 w-full object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center bg-linear-to-br from-emerald-300/35 via-lime-300/20 to-teal-300/35 text-6xl font-bold text-white/90">
                  {restaurant.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <Badge className="border-[#b8dec6] bg-[#eaf7ef] text-[#276445] dark:border-emerald-300/35 dark:bg-black/50 dark:text-emerald-200">Restaurant Profile</Badge>
                <h1 className="text-3xl font-bold text-[#10251a] sm:text-4xl dark:text-white">{restaurant.name}</h1>
                <p className="text-sm leading-7 text-[#3f5f4d] sm:text-base dark:text-[#b7c2bb]">
                  {restaurant.description || "No description available for this restaurant yet."}
                </p>
                {restaurant.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#c5e4d1] bg-[#effaf3] px-2.5 py-1 text-xs font-medium text-[#2d6a49] dark:border-emerald-300/25 dark:bg-emerald-300/10 dark:text-emerald-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#d3e6db] bg-[#eef9f1] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5a7c69] dark:text-[#9dac9f]">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-[#2d6a49] dark:text-emerald-300">
                    <Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
                    {(restaurant.ratingAvg ?? 0).toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-[#d3e6db] bg-[#eef9f1] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5a7c69] dark:text-[#9dac9f]">Total Reviews</p>
                  <p className="mt-1 text-lg font-semibold text-[#10251a] dark:text-white">{restaurant.totalReviews ?? 0}</p>
                </div>
                <div className="rounded-xl border border-[#d3e6db] bg-[#eef9f1] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5a7c69] dark:text-[#9dac9f]">Location</p>
                  <p className="mt-1 text-sm font-semibold text-[#10251a] dark:text-white">{formatLocation(restaurant.city, restaurant.state)}</p>
                </div>
                <div className="rounded-xl border border-[#d3e6db] bg-[#eef9f1] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5a7c69] dark:text-[#9dac9f]">Published</p>
                  <p className="mt-1 text-lg font-semibold text-[#10251a] dark:text-white">{formatDate(restaurant.createdAt)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#d3e6db] bg-[#eef9f1] p-4 dark:border-white/10 dark:bg-black/35">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#5a7c69] dark:text-[#9dac9f]">Address</p>
                <p className="inline-flex items-start gap-2 text-sm font-medium text-[#10251a] dark:text-white">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2d6a49] dark:text-emerald-300" />
                  {restaurant.address}, {restaurant.road}, {restaurant.city}, {restaurant.state}
                </p>

                {restaurant.contact ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#4a6a58] dark:text-[#b3bfb7]">
                    <Phone className="h-3.5 w-3.5 text-neon-gold" />
                    {restaurant.contact}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#cfe5d7] bg-[#f9fdfb]/96 backdrop-blur-sm dark:border-white/12 dark:bg-black/40">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-[#10251a] dark:text-white">Location Map</h2>

            {hasMappableLocation && mapEmbedUrl ? (
              <div className="mt-4 space-y-3">
                <div className="overflow-hidden rounded-xl border border-[#d3e6db] dark:border-white/12">
                  <iframe
                    title={`${restaurant.name} location map`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-80 w-full"
                  />
                </div>
                <p className="text-sm text-[#3f5f4d] dark:text-[#b7c2bb]">
                  Coordinates: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-[#bddbc8] bg-[#eef9f1] p-4 text-sm text-[#3f5f4d] dark:border-white/20 dark:bg-black/35 dark:text-[#b7c2bb]">
                Map is unavailable for this restaurant because latitude/longitude is missing.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#cfe5d7] bg-[#f9fdfb]/96 backdrop-blur-sm dark:border-white/12 dark:bg-black/40">
          <CardContent className="p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-[#10251a] dark:text-white">
              <Utensils className="h-5 w-5 text-[#2d6a49] dark:text-emerald-300" />
              Signature Dishes
            </h2>

            {dishes.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dishes.slice(0, 6).map((dish, index) => (
                  <MenuDishCard
                    key={dish.id}
                    id={dish.id}
                    name={dish.name}
                    restaurantName={restaurant.name}
                    tags={dish.tags}
                    ingredients={dish.ingredients}
                    imageUrl={resolveMediaUrl(dish.image)}
                    price={dish.price}
                    rating={restaurant.ratingAvg}
                    reviews={restaurant.totalReviews}
                    badgeText={`#${index + 1} Dish`}
                    mode="auto"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#3f5f4d] dark:text-[#b7c2bb]">No dishes listed for this restaurant yet.</p>
            )}
          </CardContent>
        </Card>

        {reviews.length > 0 ? (
          <Card className="rounded-2xl border border-[#cfe5d7] bg-[#f9fdfb]/96 backdrop-blur-sm dark:border-white/12 dark:bg-[#101722]/82">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-[#10251a] dark:text-white">Recent Restaurant Reviews</h2>
                  <p className="mt-1 text-sm text-[#5a7c69] dark:text-[#9dac9f]">What diners love about this restaurant</p>
                </div>
                <span className="rounded-full border border-[#b8dec6] bg-[#eaf7ef] px-3 py-1 text-xs font-semibold text-[#276445] dark:border-emerald-300/45 dark:bg-emerald-300/14 dark:text-emerald-200">
                  {reviews.length} Reviews
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {reviews.slice(0, 6).map((review) => (
                  <div
                    key={review.id}
                    className="group rounded-xl border border-[#d3e6db] bg-linear-to-br from-[#f7fcf8] to-[#ecf8ef] p-5 transition-all duration-300 hover:border-[#58a57b] hover:bg-linear-to-br hover:from-[#f1faf3] hover:to-[#e2f3e8] dark:border-white/12 dark:bg-[#182431] dark:hover:border-emerald-300/35 dark:hover:bg-[#1d2c3b]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-emerald-300 to-lime-300 text-xs font-bold text-black">
                            {(review.user?.name || "D").charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-[#10251a] dark:text-[#f3fcf7]">
                            {(review.user?.name || "Anonymous").trim() || "Anonymous"}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#b8dec6] bg-[#eaf7ef] px-2.5 py-1 text-xs font-bold text-[#276445] dark:border-emerald-300/35 dark:bg-emerald-300/14 dark:text-emerald-200">
                        <Star className="h-3.5 w-3.5 fill-emerald-300 text-emerald-300" />
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-4 leading-6 text-[#3f5f4d] dark:text-[#d6e6de]">
                      {review.comment || "Amazing experience! Will definitely come back."}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-[#617f6f] dark:text-[#aabfb5]">
                      <span className="h-1 w-1 rounded-full bg-[#88a597] dark:bg-[#a8bdb4]" />
                      <span>Verified Review</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
