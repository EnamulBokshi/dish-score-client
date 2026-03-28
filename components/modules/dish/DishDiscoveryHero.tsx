"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeroDishData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  rating?: number;
  totalReviews?: number;
  restaurantName?: string;
}

interface DishDiscoveryHeroProps {
  highlightedDish?: HeroDishData;
}

export default function DishDiscoveryHero({ highlightedDish }: DishDiscoveryHeroProps) {
  const ratingLabel = typeof highlightedDish?.rating === "number" ? highlightedDish.rating.toFixed(1) : "N/A";
  const reviewsLabel = `${highlightedDish?.totalReviews ?? 0} reviews`;

  return (
    <section className="relative overflow-hidden px-4 pb-28 pt-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,87,34,0.28),transparent_34%),radial-gradient(circle_at_82%_22%,rgba(255,0,64,0.22),transparent_34%),radial-gradient(circle_at_60%_86%,rgba(255,215,0,0.18),transparent_30%),linear-gradient(180deg,#09090d_0%,#13070b_44%,#09090d_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-neon-orange/40 bg-black/45 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-neon-gold">
            <Flame className="h-3.5 w-3.5 text-neon-orange" />
            Dish Discovery
          </p>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Find your next
            <span className="block bg-linear-to-r from-neon-pink via-neon-orange to-neon-gold bg-clip-text text-transparent">
              unforgettable plate
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#b7b7c2] sm:text-base">
            Discover trending favorites, explore the freshest additions, and compare ratings before you place an order.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="btn-neon-primary">
              <Link href="#all-dishes" className="inline-flex items-center gap-2">
                Browse All Dishes <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="btn-outline-neon">
              <Link href="#recommended-dishes">View Recommended Picks</Link>
            </Button>
          </div>
        </motion.div>

        {highlightedDish ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-14 max-w-4xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-neon-orange/35 bg-black/55 p-4 shadow-[0_30px_80px_-40px_rgba(255,87,34,0.7)] backdrop-blur-sm sm:p-5">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-neon-orange/10 via-neon-pink/8 to-neon-gold/10"
              />

              <div className="relative grid gap-4 sm:grid-cols-[1.2fr_1.4fr] sm:items-center">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#120b0b]">
                  {highlightedDish.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={highlightedDish.imageUrl}
                      alt={highlightedDish.name}
                      className="h-56 w-full object-cover sm:h-60"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-linear-to-br from-neon-orange/35 via-neon-pink/20 to-neon-gold/35 text-6xl font-bold text-white/90 sm:h-60">
                      {highlightedDish.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-1 sm:p-2">
                  <p className="inline-flex rounded-full border border-neon-gold/35 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neon-gold">
                    #1 Trending Dish
                  </p>

                  <h2 className="text-2xl font-bold text-white sm:text-3xl">{highlightedDish.name}</h2>
                  <p className="text-sm text-[#f7c19f]">{highlightedDish.restaurantName || "Community Pick"}</p>
                  <p className="line-clamp-2 text-sm leading-6 text-[#b7b7c2]">
                    {highlightedDish.description || "No description available yet."}
                  </p>

                  <div className="flex items-center gap-4 pt-1 text-sm">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-neon-orange">
                      <Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
                      {ratingLabel}
                    </span>
                    <span className="text-[#b4a49e]">{reviewsLabel}</span>
                  </div>

                  <Button asChild className="btn-neon-primary mt-1">
                    <Link href={`/dishes/${highlightedDish.id}`} className="inline-flex items-center gap-2">
                      View Dish Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
