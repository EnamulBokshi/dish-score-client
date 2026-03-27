import { Flame } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTrendingDishes } from "@/services/dish.services";
import { ITrendingDish } from "@/types/dish.types";

function getDishName(dish: ITrendingDish): string {
  return dish.name;
}

function getDishDescription(dish: ITrendingDish): string {
  return dish.description || "No description available yet.";
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
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              <span className="text-neon-orange">Trending</span> Dishes
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#a0a0a0] sm:text-base">
              Explore the dishes that food lovers are rating highly right now. Fresh picks, real opinions, and trusted
              community favorites.
            </p>
          </div>
          <div className="hidden rounded-full border border-neon-orange/40 bg-dark-card/70 p-2 text-neon-gold sm:block">
            <Flame className="h-5 w-5" />
          </div>
        </div>

        {dishes.length === 0 ? (
          <Card className="border border-dark-border bg-dark-card/60">
            <CardContent className="py-8 text-center text-[#a0a0a0]">
              Trending dishes are not available right now. Please check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish, index) => {
              const key = dish.id;
              const rating = getDishRating(dish);
              const reviewsCount = getDishReviewsCount(dish);

              return (
                <Card key={key} className="border border-dark-border bg-dark-card/80 transition-colors hover:border-neon-orange/50">
                  <CardHeader>
                    <CardDescription className="text-neon-gold">
                      #{index + 1} Trending Now
                    </CardDescription>
                    <CardTitle className="text-lg text-white">{getDishName(dish)}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="line-clamp-3 text-sm leading-6 text-[#a0a0a0]">{getDishDescription(dish)}</p>
                  </CardContent>

                  <CardFooter className="justify-between border-dark-border bg-[#141418]">
                    <p className="text-xs text-[#9a9aa7]">{getRestaurantName(dish)}</p>
                    <p className="text-sm font-semibold text-neon-orange">
                      {rating} <span className="text-xs text-[#9a9aa7]">({reviewsCount} reviews)</span>
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
