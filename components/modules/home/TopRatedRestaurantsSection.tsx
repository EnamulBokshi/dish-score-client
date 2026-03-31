import { Crown } from "lucide-react";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import { Card, CardContent } from "@/components/ui/card";
import HomeSectionFrame from "@/components/modules/home/HomeSectionFrame";
import { resolveMediaUrls } from "@/components/modules/home/card-utils";
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
    <HomeSectionFrame
      className="pb-20"
      badgeLabel="Editor Picks"
      icon={<Crown className="h-3.5 w-3.5 text-neon-orange" />}
      title="Top Rated Restaurants"
      description="Handpicked by community ratings, these restaurants are consistently serving dishes people love."
      titleGradientClassName="via-[#ffc2a5] to-neon-orange"
      cardClassName="border-amber-300/25 bg-[#130d07]/60 shadow-[0_30px_78px_-45px_rgba(251,191,36,0.62)]"
      backgroundGradientClassName="from-[#090806] via-[#231607] to-[#090806]"
      topGlowClassName="bg-amber-300/16"
      leftGlowClassName="bg-orange-300/12"
      rightGlowClassName="bg-yellow-300/12"
      link={{
        href: "/restaurants",
        label: "View All Restaurants",
      }}
    >
      {restaurants.length === 0 ? (
        <Card className="border border-dark-border bg-black/55 backdrop-blur-sm">
          <CardContent className="py-8 text-center text-[#a0a0a0]">
            Top rated restaurants are not available right now. Please check again soon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant, index) => (
            <MenuDishCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              restaurantName={getLocationLabel(restaurant)}
              imageUrl={resolveMediaUrls(restaurant.images)[0]}
              rating={restaurant.ratingAvg}
              reviews={restaurant.totalReviews}
              badgeText={`#${index + 1} Top Pick`}
              href={`/restaurants/${restaurant.id}`}
              tone={index % 2 === 0 ? "gold" : "mint"}
              priceContextLabel={`Known for: ${getPrimaryDishName(restaurant)}`}
              mode="dark"
            />
          ))}
        </div>
      )}
    </HomeSectionFrame>
  );
}
