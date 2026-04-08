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
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.14), transparent 35%), radial-gradient(circle at 78% 18%, rgba(59, 130, 246, 0.14), transparent 30%), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 100% 100%, 34px 34px, 34px 34px",
        }}
      />

      <div className="relative mx-auto max-w-7xl rounded-[2rem] border border-[#d5e0e8] bg-[#f8fbfd] p-6 text-slate-900 shadow-[0_30px_70px_-44px_rgba(15,23,42,0.2)] sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[#0c1218]/90 dark:text-slate-100 dark:shadow-[0_30px_70px_-44px_rgba(15,23,42,0.7)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-white/20 dark:bg-white/8 dark:text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
            Community Snapshot
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Discover what food lovers are rating
            <span className="text-emerald-700 dark:text-emerald-300"> right now</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
            Explore top dishes, standout restaurants, and live community activity from Dish Score.
            Track {formatCompact(totalDishes)} dishes and see where to eat next.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isLoggedIn ? (
              <>
                <Button asChild className="h-11 rounded-full bg-[#0f766e] px-6 text-white hover:bg-[#115e59] dark:bg-[#14978d] dark:hover:bg-[#1aa79b]">
                  <Link href="/reviews">Browse Reviews</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-800 hover:bg-slate-100 dark:border-white/25 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
                >
                  <Link href="/dishes">Explore Dishes</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="h-11 rounded-full bg-[#0f766e] px-6 text-white hover:bg-[#115e59] dark:bg-[#14978d] dark:hover:bg-[#1aa79b]">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-slate-300 bg-white px-6 text-slate-800 hover:bg-slate-100 hover:text-pink-500 dark:border-white/25 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15 dark:hover:text-pink-300"
                >
                  <Link href="/dishes">Explore Dishes</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid items-end gap-4 md:grid-cols-12">
          <article className="relative overflow-hidden rounded-2xl border border-[#cdd8e0] bg-linear-to-br from-[#d7f0ef] to-[#c7e5e6] p-4 text-[#143439] md:col-span-3 md:h-76 dark:border-slate-300/35 dark:from-[#0d3f45] dark:to-[#06252a] dark:text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80">#1 Dish</p>
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#143439] dark:text-white">{topDish?.name || "No top dish yet"}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-[#2f656a] dark:text-emerald-50/80">
              {topDish?.restaurant?.name || "Awaiting community ratings"}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#2f656a] dark:text-emerald-100/90">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              {topDish ? `${safeNumber(topDish.totalReviews)} reviews` : "No reviews yet"}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-[#9ec7c6] bg-white/50 dark:border-white/20 dark:bg-white/10">
              {topDishImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={topDishImage}
                  alt={topDish?.name || "Top dish"}
                  className="h-34 w-full object-cover"
                />
              ) : (
                <div className="flex h-34 items-center justify-center text-sm text-[#2f656a] dark:text-emerald-100/80">
                  Dish image unavailable
                </div>
              )}
            </div>
          </article>

          <div className="grid gap-4 md:col-span-6 md:grid-cols-3 md:items-end">
            <article className="rounded-2xl border border-[#aad0ca] bg-linear-to-br from-[#d8efec] to-[#cbe7e4] p-4 text-[#11353d] md:h-60 dark:border-teal-900/30 dark:from-[#075a5f] dark:to-[#073c46] dark:text-white">
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[#255f69] dark:text-teal-100/80">
                <MessageSquareText className="h-3.5 w-3.5 text-[#0c6a61] dark:text-emerald-200" />
                Total Reviews
              </p>
              <p className="mt-3 text-3xl font-bold text-[#11353d] dark:text-white">{formatCompact(totalReviews)}</p>
              <p className="mt-1 text-xs text-[#255f69] dark:text-teal-100/80">Community review entries</p>
            </article>

            <article className="rounded-2xl border border-slate-300 bg-white p-4 md:h-52 dark:border-white/20 dark:bg-white/8">
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                <Users className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
                Total Reviewer
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{formatCompact(totalReviewer)}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">Active contributors</p>
            </article>

            <article className="rounded-2xl border border-emerald-300/60 bg-linear-to-br from-[#ccf6c9] to-[#b9efb8] p-4 text-[#16361d] md:h-60 dark:border-emerald-500/30 dark:from-[#104229] dark:to-[#173f2b] dark:text-emerald-100">
              <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-emerald-900/75 dark:text-emerald-200/80">
                <Store className="h-3.5 w-3.5 text-emerald-800 dark:text-emerald-300" />
                Total Restaurant
              </p>
              <p className="mt-3 text-3xl font-bold text-emerald-950 dark:text-emerald-100">{formatCompact(totalRestaurants)}</p>
              <p className="mt-1 text-xs text-emerald-900/75 dark:text-emerald-200/80">Restaurants onboarded</p>
            </article>
          </div>

          <article className="relative overflow-hidden rounded-2xl border border-[#c7d8ea] bg-linear-to-br from-[#d9ebff] to-[#c9ddf7] p-4 text-[#163b60] md:col-span-3 md:h-76 dark:border-slate-300/35 dark:from-[#072d53] dark:to-[#0a1f32] dark:text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-[#2f5f8e] dark:text-sky-100/80">#1 Restaurant</p>
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#163b60] dark:text-white">{topRestaurant?.name || "No top restaurant yet"}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-[#2f5f8e] dark:text-sky-100/80">
              {topRestaurant ? `${topRestaurant.city}, ${topRestaurant.state}` : "Awaiting community ratings"}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#2f5f8e] dark:text-sky-100/90">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {topRestaurant
                ? `${safeNumber(topRestaurant.ratingAvg).toFixed(1)} avg rating`
                : "No rating yet"}
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-[#9eb9d4] bg-white/55 dark:border-white/20 dark:bg-white/10">
              {topRestaurantImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={topRestaurantImage}
                  alt={topRestaurant?.name || "Top restaurant"}
                  className="h-34 w-full object-cover"
                />
              ) : (
                <div className="flex h-34 items-center justify-center text-sm text-[#2f5f8e] dark:text-sky-100/80">
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
