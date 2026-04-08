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
  console.log("Dish details:", dish);
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-22 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#fff8f2] via-[#fcefe4] to-[#fff8f2] dark:from-[#07070b] dark:via-[#2a060f] dark:to-[#09070a]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-neon-orange/10 blur-3xl dark:bg-neon-orange/20"
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Button asChild variant="outline" className="border-[#d8c7bb] bg-white text-[#5c4338] hover:bg-[#f7ece6] dark:btn-outline-neon dark:border-[#FF5722] dark:bg-transparent dark:text-[#FF5722]">
          <Link href="/dishes" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dishes
          </Link>
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-[#dfcfc4] bg-[#fff8f2]/96 shadow-[0_24px_50px_-36px_rgba(115,74,52,0.35)] backdrop-blur-sm dark:border-white/12 dark:bg-black/45 dark:shadow-[0_30px_75px_-42px_rgba(255,109,43,0.65)]">
          <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="overflow-hidden rounded-2xl border border-[#e1d2c8] bg-[#fff4ec] dark:border-white/10 dark:bg-[#100907]">
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
                <Badge className="border-[#e7b088] bg-[#ffeedd] text-[#9d4d30] dark:border-neon-orange/35 dark:bg-black/50 dark:text-[#ffd199]">Dish Details</Badge>
                <h1 className="text-3xl font-bold text-[#1f1511] sm:text-4xl dark:text-white">{dish.name}</h1>
                <p className="text-sm leading-7 text-[#5c4b43] sm:text-base dark:text-[#b7b7c2]">
                  {dish.description || "No description available for this dish yet."}
                </p>
                {dish.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {dish.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#dcc8bc] bg-[#fff2e7] px-2.5 py-1 text-xs font-medium text-[#6b4f41] dark:border-white/20 dark:bg-white/5 dark:text-[#d8cfc8]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {dish.ingredients?.length ? (
                  <div className="rounded-xl border border-[#e1d2c8] bg-[#fff3ea] p-3 dark:border-white/10 dark:bg-black/35">
                    <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8a776c] dark:text-[#9d9dac]">Ingredients</p>
                    <div className="flex flex-wrap gap-2">
                      {dish.ingredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full border border-[#e5be7e] bg-[#ffecc8] px-2.5 py-1 text-xs font-medium text-[#8a5d1f] dark:border-neon-gold/25 dark:bg-neon-gold/10 dark:text-[#f7d487]"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#e1d2c8] bg-[#fff3ea] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a776c] dark:text-[#9d9dac]">Price</p>
                  <p className="mt-1 text-lg font-semibold text-[#a26a1e] dark:text-neon-gold">{formatCurrency(dish.price)}</p>
                </div>
                <div className="rounded-xl border border-[#e1d2c8] bg-[#fff3ea] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a776c] dark:text-[#9d9dac]">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-[#b24f35] dark:text-neon-orange">
                    <Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
                    {(dish.ratingAvg ?? 0).toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-[#e1d2c8] bg-[#fff3ea] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a776c] dark:text-[#9d9dac]">Total Reviews</p>
                  <p className="mt-1 text-lg font-semibold text-[#1f1511] dark:text-white">{dish.totalReviews ?? 0}</p>
                </div>
                <div className="rounded-xl border border-[#e1d2c8] bg-[#fff3ea] p-3 dark:border-white/10 dark:bg-black/35">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#8a776c] dark:text-[#9d9dac]">Published</p>
                  <p className="mt-1 text-lg font-semibold text-[#1f1511] dark:text-white">{formatDate(dish.createdAt)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e1d2c8] bg-[#fff3ea] p-4 dark:border-white/10 dark:bg-black/35">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8a776c] dark:text-[#9d9dac]">Restaurant</p>
                <p className="inline-flex items-center gap-2 text-base font-semibold text-[#1f1511] dark:text-white">
                  <Utensils className="h-4 w-4 text-[#b24f35] dark:text-neon-orange" />
                  {restaurantLabel}
                </p>
                {locationLabel ? (
                  <p className="mt-1 inline-flex items-center gap-2 text-sm text-[#6f5e55] dark:text-[#b3b3bf]">
                    <MapPin className="h-3.5 w-3.5 text-[#a26a1e] dark:text-neon-gold" />
                    {locationLabel}
                  </p>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {recentReviews.length > 0 ? (
          <Card className="rounded-2xl border border-[#dfcfc4] bg-[#fff8f2]/96 backdrop-blur-sm dark:border-white/12 dark:bg-[#10131d]/85">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#1f1511] dark:text-white">Recent Dish Reviews</h2>
                <span className="rounded-full border border-[#e7b088] bg-[#ffeedd] px-3 py-1 text-xs font-semibold text-[#9d4d30] dark:border-neon-orange/40 dark:bg-neon-orange/14 dark:text-[#ffc79a]">
                  {recentReviews.length} Reviews
                </span>
              </div>
              <p className="text-sm text-[#7a685f] dark:text-[#b1b5c4]">What people are saying about this dish</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="group rounded-xl border border-[#e1d2c8] bg-linear-to-br from-[#fff7ef] to-[#fff0e5] p-5 transition-all duration-300 hover:border-[#e27a56] hover:bg-linear-to-br hover:from-[#fff3ea] hover:to-[#ffe9dc] dark:border-white/12 dark:from-[#1a2130] dark:to-[#1f2a3a] dark:hover:border-neon-orange/35 dark:hover:from-[#202c3d] dark:hover:to-[#243244]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-neon-orange to-neon-gold text-xs font-bold text-black">
                            {(review.user?.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <p className="font-semibold text-[#1f1511] dark:text-white">
                            {(review.user?.name || "Anonymous").trim() || "Anonymous"}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-neon-orange/35 bg-neon-orange/14 px-2.5 py-1 text-xs font-bold text-[#ffd4aa]">
                        <Star className="h-3.5 w-3.5 fill-neon-gold text-neon-gold" />
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-4 leading-6 text-[#5b4a42] dark:text-[#d7deed]">
                      {review.comment || "Great dish! Highly recommend."}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-[#7b6a62] dark:text-[#a7afc2]">
                      <span className="h-1 w-1 rounded-full bg-[#a0897d] dark:bg-[#a7afc2]" />
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
