import Link from "next/link";
import {
  ArrowUpRight,
  MessageSquareText,
  Sparkles,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/services/auth.services";
import { getTrendingDishes } from "@/services/dish.services";
import { getTopRatedRestaurants } from "@/services/restaurant.services";
import { getPublicStats } from "@/services/stats.services";

function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function safeNumber(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export default async function SecondHeroSection() {
  const [stats, userInfo, trendingDishes, topRestaurants] = await Promise.all([
    getPublicStats(),
    getUserInfo(),
    getTrendingDishes(),
    getTopRatedRestaurants(),
  ]);

  const isLoggedIn = Boolean(userInfo?.id);

  const totalReviews = safeNumber(stats?.totalReviews);
  const totalReviewer = safeNumber(stats?.totalReviewer);
  const totalRestaurants = safeNumber(stats?.totalRestaurants);
  const totalDishes = safeNumber(stats?.totalDishes);

  const topDish = trendingDishes[0] || null;
  const topRestaurant = topRestaurants[0] || null;

  const topDishImage = resolveMediaUrl(topDish?.image);
  const topRestaurantImage = resolveMediaUrl(topRestaurant?.images?.[0]);

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.14), transparent 35%), radial-gradient(circle at 78% 18%, rgba(59, 130, 246, 0.14), transparent 30%), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 34px 34px, 34px 34px",
        }}
      />

      <div className="relative mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-[#f2f5f7] p-6 text-slate-900 shadow-[0_30px_70px_-44px_rgba(15,23,42,0.5)] sm:p-8 lg:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Community Snapshot
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Discover what food lovers are rating
            <span className="text-emerald-700"> right now</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Explore top dishes, standout restaurants, and live community activity from Dish Score.
            Track {formatCompact(totalDishes)} dishes and see where to eat next.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isLoggedIn ? (
              <>
                <Button asChild className="h-11 rounded-full bg-[#0f766e] px-6 text-white hover:bg-[#115e59]">
                  <Link href="/reviews">Browse Reviews</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-800 hover:bg-slate-100"
                >
                  <Link href="/dishes">Explore Dishes</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="h-11 rounded-full bg-[#0f766e] px-6 text-white hover:bg-[#115e59]">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-800 hover:bg-slate-100 hover:text-pink-500"
                >
                  <Link href="/dishes">Explore Dishes</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid items-end gap-4 md:grid-cols-12">
          <article className="relative overflow-hidden rounded-2xl border border-slate-300 bg-linear-to-br from-[#0d3f45] to-[#06252a] p-4 text-white md:col-span-3 md:h-76">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80">#1 Dish</p>
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold">{topDish?.name || "No top dish yet"}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-emerald-50/80">
              {topDish?.restaurant?.name || "Awaiting community ratings"}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-100/90">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              {topDish ? `${safeNumber(topDish.totalReviews)} reviews` : "No reviews yet"}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/20 bg-white/10">
              {topDishImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={topDishImage}
                  alt={topDish?.name || "Top dish"}
                  className="h-34 w-full object-cover"
                />
              ) : (
                <div className="flex h-34 items-center justify-center text-sm text-emerald-100/80">
                  Dish image unavailable
                </div>
              )}
            </div>
          </article>

          <div className="grid gap-4 md:col-span-6 md:grid-cols-3 md:items-end">
            <article className="rounded-2xl border border-teal-900/30 bg-linear-to-br from-[#075a5f] to-[#073c46] p-4 text-white md:h-60">
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-teal-100/80">
                <MessageSquareText className="h-3.5 w-3.5 text-emerald-200" />
                Total Reviews
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{formatCompact(totalReviews)}</p>
              <p className="mt-1 text-xs text-teal-100/80">Community review entries</p>
            </article>

            <article className="rounded-2xl border border-slate-300 bg-white p-4 md:h-52">
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-slate-500">
                <Users className="h-3.5 w-3.5 text-emerald-700" />
                Total Reviewer
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{formatCompact(totalReviewer)}</p>
              <p className="mt-1 text-xs text-slate-500">Active contributors</p>
            </article>

            <article className="rounded-2xl border border-emerald-300/60 bg-linear-to-br from-[#ccf6c9] to-[#b9efb8] p-4 text-[#16361d] md:h-60">
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-emerald-900/75">
                <Store className="h-3.5 w-3.5 text-emerald-800" />
                Total Restaurant
              </p>
              <p className="mt-3 text-3xl font-bold text-emerald-950">{formatCompact(totalRestaurants)}</p>
              <p className="mt-1 text-xs text-emerald-900/75">Restaurants onboarded</p>
            </article>
          </div>

          <article className="relative overflow-hidden rounded-2xl border border-slate-300 bg-linear-to-br from-[#072d53] to-[#0a1f32] p-4 text-white md:col-span-3 md:h-76">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-100/80">#1 Restaurant</p>
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold">{topRestaurant?.name || "No top restaurant yet"}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-sky-100/80">
              {topRestaurant ? `${topRestaurant.city}, ${topRestaurant.state}` : "Awaiting community ratings"}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-sky-100/90">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {topRestaurant
                ? `${safeNumber(topRestaurant.ratingAvg).toFixed(1)} avg rating`
                : "No rating yet"}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/20 bg-white/10">
              {topRestaurantImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={topRestaurantImage}
                  alt={topRestaurant?.name || "Top restaurant"}
                  className="h-34 w-full object-cover"
                />
              ) : (
                <div className="flex h-34 items-center justify-center text-sm text-sky-100/80">
                  Restaurant image unavailable
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
