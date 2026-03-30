"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Star, Utensils } from "lucide-react";
import { motion } from "framer-motion";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRestaurantById } from "@/services/restaurant.services";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

function formatDate(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocation(city?: string, state?: string) {
  return [city, state].filter(Boolean).join(", ") || "Unknown";
}

export default async function RestaurantDetailsPageComponent({ params }: Props) {
  const restaurant = await getRestaurantById(params.id);
  if (!restaurant) return notFound();

  const heroImage = resolveMediaUrl(restaurant.images?.[0]);
  const dishes = restaurant.dishes || [];

  const lat = Number(restaurant.location?.lat);
  const lng = Number(restaurant.location?.lng);

  const mapUrl =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `https://maps.google.com/maps?q=${lat},${lng}&z=18&output=embed`
      : null;

  return (
    <section className="relative px-4 pb-20 pt-24 sm:px-6 lg:px-8 bg-[#07070b]">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Back Button */}
        <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <Link href="/restaurants" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Link>
        </Button>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[420px] w-full overflow-hidden rounded-3xl"
        >
          {heroImage && (
            <img
              src={heroImage}
              alt={restaurant.name}
              className="h-full w-full object-cover scale-105 transition duration-700 hover:scale-110"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Restaurant
            </Badge>

            <h1 className="mt-3 text-3xl sm:text-5xl font-bold text-white">
              {restaurant.name}
            </h1>

            <div className="mt-3 flex items-center gap-5 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {(restaurant.ratingAvg ?? 0).toFixed(1)}
              </span>

              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {formatLocation(restaurant.city, restaurant.state)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* FLOATING STATS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="-mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10"
        >
          {[
            { label: "Rating", value: (restaurant.ratingAvg ?? 0).toFixed(1) },
            { label: "Reviews", value: restaurant.totalReviews ?? 0 },
            { label: "Published", value: formatDate(restaurant.createdAt) },
            { label: "Contact", value: restaurant.contact || "N/A" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 p-4 hover:border-emerald-400/40 transition"
            >
              <p className="text-xs text-gray-400 uppercase">{item.label}</p>
              <p className="text-lg font-semibold text-white mt-1">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* DESCRIPTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-2">About</h2>
          <p className="text-gray-300 text-sm leading-7">
            {restaurant.description || "No description available."}
          </p>
        </motion.div>

        {/* MAP */}
        {mapUrl && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-2xl border border-white/10"
          >
            <iframe
              src={mapUrl}
              className="w-full h-80 grayscale hover:grayscale-0 transition duration-500"
            />
            <div className="p-3 text-sm text-gray-400 flex items-center gap-2">
              <MapPin size={14} />
              {restaurant.address}, {restaurant.city}
            </div>
          </motion.div>
        )}

        {/* DISHES */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Utensils className="text-emerald-400" size={18} />
            Signature Dishes
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.slice(0, 6).map((dish) => (
              <motion.div
                key={dish.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group relative"
              >
                <div className="transform transition duration-300 group-hover:-translate-y-2">
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
                    mode="dark"
                  />
                </div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/10 blur-xl transition" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}