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
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#07070b] via-[#172009] to-[#07070b]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Button asChild variant="outline" className="border-emerald-300/40 text-emerald-300 hover:bg-emerald-300/10">
          <Link href="/restaurants" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Restaurants
          </Link>
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-white/12 bg-black/45 shadow-[0_30px_75px_-42px_rgba(16,185,129,0.55)] backdrop-blur-sm">
          <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07100b]">
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
                <Badge className="border-emerald-300/35 bg-black/50 text-emerald-200">Restaurant Profile</Badge>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{restaurant.name}</h1>
                <p className="text-sm leading-7 text-[#b7c2bb] sm:text-base">
                  {restaurant.description || "No description available for this restaurant yet."}
                </p>
                {restaurant.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9dac9f]">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-emerald-300">
                    <Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
                    {(restaurant.ratingAvg ?? 0).toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9dac9f]">Total Reviews</p>
                  <p className="mt-1 text-lg font-semibold text-white">{restaurant.totalReviews ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9dac9f]">Location</p>
                  <p className="mt-1 text-sm font-semibold text-white">{formatLocation(restaurant.city, restaurant.state)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9dac9f]">Published</p>
                  <p className="mt-1 text-lg font-semibold text-white">{formatDate(restaurant.createdAt)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/35 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9dac9f]">Address</p>
                <p className="inline-flex items-start gap-2 text-sm font-medium text-white">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  {restaurant.address}, {restaurant.road}, {restaurant.city}, {restaurant.state}
                </p>

                {restaurant.contact ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#b3bfb7]">
                    <Phone className="h-3.5 w-3.5 text-neon-gold" />
                    {restaurant.contact}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/12 bg-black/40 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white">Location Map</h2>

            {hasMappableLocation && mapEmbedUrl ? (
              <div className="mt-4 space-y-3">
                <div className="overflow-hidden rounded-xl border border-white/12">
                  <iframe
                    title={`${restaurant.name} location map`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-80 w-full"
                  />
                </div>
                <p className="text-sm text-[#b7c2bb]">
                  Coordinates: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-white/20 bg-black/35 p-4 text-sm text-[#b7c2bb]">
                Map is unavailable for this restaurant because latitude/longitude is missing.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/12 bg-black/40 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
              <Utensils className="h-5 w-5 text-emerald-300" />
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
                    mode="dark"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#b7c2bb]">No dishes listed for this restaurant yet.</p>
            )}
          </CardContent>
        </Card>

        {reviews.length > 0 ? (
          <Card className="rounded-2xl border border-white/12 bg-black/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">Recent Restaurant Reviews</h2>
                <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Link href={`/reviews?restaurantId=${restaurant.id}`}>View All Reviews</Link>
                </Button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {reviews.slice(0, 6).map((review) => (
                  <Link
                    key={review.id}
                    href={`/reviews/${review.id}`}
                    className="group rounded-xl border border-white/10 bg-black/35 p-4 text-sm text-[#b5c2ba] transition-all hover:-translate-y-0.5 hover:border-emerald-300/45 hover:bg-black/45"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-white/95">
                        {(review.user?.name || "Anonymous").trim() || "Anonymous"}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-xs font-semibold text-amber-200">
                        <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#b5c2ba]">
                      {review.comment || "No comment added."}
                    </p>

                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-200/90">
                      Open review details
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
