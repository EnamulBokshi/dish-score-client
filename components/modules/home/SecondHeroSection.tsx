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
    <section
      className="px-4 pb-4 pt-0 sm:px-6 lg:px-8"
      style={{ background: "#d4d0c8", fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Win2K window */}
        <div className="win-panel">
          {/* Title bar */}
          <div
            className="win-titlebar flex items-center gap-2 px-2 py-1 select-none"
            style={{ background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)" }}
          >
            <Sparkles className="h-3 w-3 text-yellow-300" aria-hidden />
            <span className="font-bold text-[11px] text-white">Community Snapshot</span>
          </div>

          <div className="p-4">
            {/* Header */}
            <div
              className="mb-4 p-3 text-center"
              style={{ background: "#ece9d8", border: "1px solid #808080" }}
            >
              <h2 className="text-[15px] font-bold text-[#0a246a]">
                Discover what food lovers are rating right now
              </h2>
              <p className="mt-1 text-[11px] text-[#444444]">
                Explore top dishes, standout restaurants, and live community activity. Tracking{" "}
                <strong>{formatCompact(totalDishes)}</strong> dishes across the platform.
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {isLoggedIn ? (
                  <>
                    <Link href="/reviews" className="btn-win px-4 py-0.5 text-[11px]">Browse Reviews</Link>
                    <Link href="/dishes" className="btn-win px-4 py-0.5 text-[11px]">Explore Dishes</Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className="px-4 py-0.5 text-[11px] font-bold text-black"
                      style={{
                        background: "#d4d0c8",
                        border: "1px solid #000000",
                        borderTop: "2px solid #ffffff",
                        borderLeft: "2px solid #ffffff",
                        borderRight: "2px solid #404040",
                        borderBottom: "2px solid #404040",
                        boxShadow: "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080",
                      }}
                    >
                      Get Started
                    </Link>
                    <Link href="/dishes" className="btn-win px-4 py-0.5 text-[11px]">Explore Dishes</Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Stat boxes */}
              {[
                { label: "Total Reviews", icon: <MessageSquareText className="h-4 w-4" />, value: formatCompact(totalReviews), sub: "Community entries" },
                { label: "Total Reviewers", icon: <Users className="h-4 w-4" />, value: formatCompact(totalReviewer), sub: "Active contributors" },
                { label: "Restaurants", icon: <Store className="h-4 w-4" />, value: formatCompact(totalRestaurants), sub: "Onboarded" },
                { label: "Dishes Listed", icon: <UtensilsCrossed className="h-4 w-4" />, value: formatCompact(totalDishes), sub: "Tracked dishes" },
              ].map((stat) => (
                <div key={stat.label} className="win-raised p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#0a246a] uppercase tracking-wide">
                    <span className="text-[#0a246a]" aria-hidden>{stat.icon}</span>
                    {stat.label}
                  </div>
                  <div
                    className="mt-2 text-[22px] font-bold text-[#cc0000]"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-[10px] text-[#666666]">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Top dish + top restaurant */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {/* Top dish */}
              <div className="win-raised overflow-hidden">
                <div
                  className="px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(to right, #0a246a, #4872c4)" }}
                >
                  #1 Dish
                </div>
                <div className="flex gap-3 p-3">
                  <div
                    className="h-20 w-20 shrink-0 overflow-hidden"
                    style={{
                      border: "2px solid",
                      borderColor: "#404040 #ffffff #ffffff #404040",
                    }}
                  >
                    {topDishImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={topDishImage} alt={topDish?.name || "Top dish"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] text-[#666666]" style={{ background: "#ece9d8" }}>
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-[#0a246a]">{topDish?.name || "No top dish yet"}</h3>
                    <p className="text-[10px] text-[#444444]">{topDish?.restaurant?.name || "Awaiting ratings"}</p>
                    <p className="mt-1 text-[10px] text-[#666666]">
                      <UtensilsCrossed className="inline h-3 w-3 mr-0.5" />
                      {topDish ? `${safeNumber(topDish.totalReviews)} reviews` : "No reviews yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Top restaurant */}
              <div className="win-raised overflow-hidden">
                <div
                  className="px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(to right, #0a246a, #4872c4)" }}
                >
                  #1 Restaurant
                </div>
                <div className="flex gap-3 p-3">
                  <div
                    className="h-20 w-20 shrink-0 overflow-hidden"
                    style={{
                      border: "2px solid",
                      borderColor: "#404040 #ffffff #ffffff #404040",
                    }}
                  >
                    {topRestaurantImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={topRestaurantImage} alt={topRestaurant?.name || "Top restaurant"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] text-[#666666]" style={{ background: "#ece9d8" }}>
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-[#0a246a]">{topRestaurant?.name || "No top restaurant yet"}</h3>
                    <p className="text-[10px] text-[#444444]">
                      {topRestaurant ? `${topRestaurant.city}, ${topRestaurant.state}` : "Awaiting ratings"}
                    </p>
                    <p className="mt-1 text-[10px] text-[#666666]">
                      <ArrowUpRight className="inline h-3 w-3 mr-0.5" />
                      {topRestaurant ? `${safeNumber(topRestaurant.ratingAvg).toFixed(1)} avg rating` : "No rating yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="flex items-center gap-2 px-2 py-0.5 text-[10px] text-[#444444]"
            style={{ background: "#d4d0c8", borderTop: "1px solid #808080" }}
          >
            <span className="win-sunken px-2">Done</span>
            <span className="win-sunken px-2">{formatCompact(totalDishes)} dishes tracked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
