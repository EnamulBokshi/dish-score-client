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
      titleGradientClassName="via-[#b4672f] to-[#8e4f1f] dark:via-[#ffc2a5] dark:to-neon-orange"
      cardClassName="border-[#e3d1b7] bg-[#fff9ef]/96 shadow-[0_30px_66px_-48px_rgba(182,128,67,0.45)] dark:border-amber-300/25 dark:bg-[#130d07]/60 dark:shadow-[0_30px_78px_-45px_rgba(251,191,36,0.62)]"
      backgroundGradientClassName="from-[#fff9f0] via-[#fbf1e2] to-[#fff9f0] dark:from-[#090806] dark:via-[#231607] dark:to-[#090806]"
      topGlowClassName="bg-amber-300/9 dark:bg-amber-300/16"
      leftGlowClassName="bg-orange-300/8 dark:bg-orange-300/12"
      rightGlowClassName="bg-yellow-300/8 dark:bg-yellow-300/12"
      link={{
        href: "/restaurants",
        label: "View All Restaurants",
      }}
    >
      {restaurants.length === 0 ? (
        <Card className="border border-[#e2d4c2] bg-[#fff8f1] backdrop-blur-sm dark:border-dark-border dark:bg-black/55">
          <CardContent className="py-8 text-center text-[#5b4f45] dark:text-[#a0a0a0]">
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
              mode="auto"
            />
          ))}
        </div>
      )}
    </HomeSectionFrame>
  );
}
