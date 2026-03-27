import { Crown, MapPin, Utensils } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTopRatedRestaurants } from "@/services/restaurant.services";
import { ITopRatedRestaurant } from "@/types/restaurant.types";

function getPrimaryDishName(restaurant: ITopRatedRestaurant): string {
  if (restaurant.dishes.length === 0) {
    return "No dishes listed yet";
  }

  return restaurant.dishes[0].name;
}

function getLocationLabel(restaurant: ITopRatedRestaurant): string {
  return `${restaurant.city}, ${restaurant.state}`;
}

export default async function TopRatedRestaurantsSection() {
  const restaurants = await getTopRatedRestaurants();

  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Top Rated <span className="text-neon-orange">Restaurants</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[#a0a0a0] sm:text-base">
              Handpicked by community ratings, these restaurants are consistently serving dishes people love.
            </p>
          </div>
          <div className="hidden rounded-full border border-neon-orange/40 bg-dark-card/70 p-2 text-neon-gold sm:block">
            <Crown className="h-5 w-5" />
          </div>
        </div>

        {restaurants.length === 0 ? (
          <Card className="border border-dark-border bg-dark-card/60">
            <CardContent className="py-8 text-center text-[#a0a0a0]">
              Top rated restaurants are not available right now. Please check again soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant, index) => (
              <Card
                key={restaurant.id}
                className="border border-dark-border bg-dark-card/80 transition-colors hover:border-neon-orange/50"
              >
                <CardHeader>
                  <CardDescription className="text-neon-gold">#{index + 1} Top Pick</CardDescription>
                  <CardTitle className="text-lg text-white">{restaurant.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-sm leading-6 text-[#a0a0a0]">{restaurant.description}</p>

                  <div className="space-y-2 text-sm text-[#b7b7c2]">
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neon-gold" />
                      <span>{getLocationLabel(restaurant)}</span>
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-neon-orange" />
                      <span>{getPrimaryDishName(restaurant)}</span>
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="justify-between border-dark-border bg-[#141418]">
                  <p className="text-sm font-semibold text-neon-orange">{restaurant.ratingAvg.toFixed(1)} rating</p>
                  <p className="text-xs text-[#9a9aa7]">{restaurant.totalReviews} reviews</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
