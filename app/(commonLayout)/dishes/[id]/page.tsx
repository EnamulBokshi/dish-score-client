import Link from "next/link";
import { ArrowLeft, MapPin, Star, Utensils } from "lucide-react";
import { notFound } from "next/navigation";

import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDishById } from "@/services/dish.services";

interface DishDetailsPageProps {
  params: Promise<{ id: string }>;
}

function formatCurrency(value?: number): string {
  if (typeof value !== "number") {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
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

export default async function DishDetailsPage({ params }: DishDetailsPageProps) {
  const { id } = await params;
  const dish = await getDishById(id);

  if (!dish) {
    notFound();
  }

  const imageSrc = resolveMediaUrl(dish.image);
  const restaurantLabel = dish.restaurant?.name || "Community Pick";
  const locationLabel = [dish.restaurant?.city, dish.restaurant?.state].filter(Boolean).join(", ");
  const recentReviews = dish.reviews?.slice(0, 5) || [];

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-22 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#07070b] via-[#2a060f] to-[#09070a]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-neon-orange/20 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Button asChild variant="outline" className="btn-outline-neon">
          <Link href="/dishes" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dishes
          </Link>
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-white/12 bg-black/45 shadow-[0_30px_75px_-42px_rgba(255,109,43,0.65)] backdrop-blur-sm">
          <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#100907]">
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageSrc} alt={dish.name} className="h-full max-h-105 w-full object-cover" />
              ) : (
                <div className="flex h-80 items-center justify-center bg-linear-to-br from-neon-orange/35 via-neon-pink/20 to-neon-gold/35 text-6xl font-bold text-white/90">
                  {dish.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <Badge className="border-neon-orange/35 bg-black/50 text-[#ffd199]">Dish Details</Badge>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{dish.name}</h1>
                <p className="text-sm leading-7 text-[#b7b7c2] sm:text-base">
                  {dish.description || "No description available for this dish yet."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9d9dac]">Price</p>
                  <p className="mt-1 text-lg font-semibold text-neon-gold">{formatCurrency(dish.price)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9d9dac]">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-neon-orange">
                    <Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
                    {(dish.ratingAvg ?? 0).toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9d9dac]">Total Reviews</p>
                  <p className="mt-1 text-lg font-semibold text-white">{dish.totalReviews ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9d9dac]">Published</p>
                  <p className="mt-1 text-lg font-semibold text-white">{formatDate(dish.createdAt)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/35 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#9d9dac]">Restaurant</p>
                <p className="inline-flex items-center gap-2 text-base font-semibold text-white">
                  <Utensils className="h-4 w-4 text-neon-orange" />
                  {restaurantLabel}
                </p>
                {locationLabel ? (
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-[#b3b3bf]">
                    <MapPin className="h-3.5 w-3.5 text-neon-gold" />
                    {locationLabel}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {recentReviews.length > 0 ? (
          <Card className="rounded-2xl border border-white/12 bg-black/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white">Recent Dish Reviews</h2>
              <div className="mt-4 space-y-3">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-white/10 bg-black/35 p-4 text-sm text-[#b5b5c2]"
                  >
                    <p className="font-medium text-white/95">
                      {(review.user?.name || "Anonymous")} rated {review.rating.toFixed(1)}
                    </p>
                    <p className="mt-1">{review.comment || "No comment added."}</p>
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
