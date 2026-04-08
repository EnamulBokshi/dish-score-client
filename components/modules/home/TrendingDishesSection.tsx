import { Flame } from "lucide-react";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import { Card, CardContent } from "@/components/ui/card";
import HomeSectionFrame from "@/components/modules/home/HomeSectionFrame";
import { resolveMediaUrl } from "@/components/modules/home/card-utils";
import { getTrendingDishes } from "@/services/dish.services";
import { ITrendingDish } from "@/types/dish.types";

function getDishName(dish: ITrendingDish): string {
  return dish.name;
}

function getDishRating(dish: ITrendingDish): string {
  const value = dish.ratingAvg;
  if (typeof value !== "number") {
    return "N/A";
  }
  return value.toFixed(1);
}

function getDishReviewsCount(dish: ITrendingDish): number {
  return dish.totalReviews;
}

function getRestaurantName(dish: ITrendingDish): string {
  return dish.restaurant?.name || "Community Pick";
}

export default async function TrendingDishesSection() {
  const dishes = await getTrendingDishes();

  return (
    <HomeSectionFrame
      className="py-18"
      badgeLabel="Popular Right Now"
      icon={<Flame className="h-3.5 w-3.5 text-neon-orange" />}
      title="Trending Dishes"
      description="Explore dishes that food lovers are rating highly right now. Fresh picks, real opinions, and trusted community favorites."
      cardClassName="border-[#e5c8b6] bg-[#fff7f1]/96 shadow-[0_26px_58px_-40px_rgba(158,94,63,0.35)] dark:border-[#3a2a24] dark:bg-black/45 dark:shadow-[0_30px_75px_-42px_rgba(255,109,43,0.65)]"
      backgroundGradientClassName="from-[#fff8f2] via-[#fcefe4] to-[#fff7f0] dark:from-[#07070b] dark:via-[#2a060f] dark:to-[#09070a]"
      topGlowClassName="bg-neon-orange/8 dark:bg-neon-orange/20"
      leftGlowClassName="bg-neon-pink/6 dark:bg-neon-pink/14"
      rightGlowClassName="bg-neon-orange/6 dark:bg-neon-orange/14"
      link={{
        href: "/dishes",
        label: "View All Dishes",
      }}
    >
      {dishes.length === 0 ? (
        <Card className="border border-[#dfcfc5] bg-[#fff8f3] backdrop-blur-sm dark:border-dark-border dark:bg-black/55">
          <CardContent className="py-8 text-center text-[#5f4f47] dark:text-[#a0a0a0]">
            Trending dishes are not available right now. Please check back soon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, index) => {
            const key = dish.id;
            const rating = getDishRating(dish);
            const reviewsCount = getDishReviewsCount(dish);
            const dishImage = resolveMediaUrl(dish.image);

            return (
              <MenuDishCard
                key={key}
                id={dish.id}
                name={getDishName(dish)}
                restaurantName={getRestaurantName(dish)}
                ingredients={dish.ingredients}
                imageUrl={dishImage}
                price={dish.price}
                rating={Number(rating)}
                reviews={reviewsCount}
                badgeText={`#${index + 1} Trending`}
                tone={index % 2 === 0 ? "orange" : "gold"}
                mode="auto"
              />
            );
          })}
        </div>
      )}
    </HomeSectionFrame>
  );
}
