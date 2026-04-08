import { MessageCircle } from "lucide-react";

import MenuDishCard from "@/components/modules/dish/MenuDishCard";
import { Card, CardContent } from "@/components/ui/card";
import HomeSectionFrame from "@/components/modules/home/HomeSectionFrame";
import { resolveMediaUrls } from "@/components/modules/home/card-utils";
import { getRecentReviews } from "@/services/review.services";
import { IRecentReview } from "@/types/review.types";

function formatReviewDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function RecentReviewsSection() {
  const reviews = await getRecentReviews();

  return (
    <HomeSectionFrame
      badgeLabel="Fresh Opinions"
      icon={<MessageCircle className="h-3.5 w-3.5 text-neon-orange" />}
      title="Recent Reviews"
      description="See what the community is saying right now. Fresh ratings and feedback from real diners across popular dishes."
      badgeClassName="border-[#c9b58c] text-[#8b6632] dark:border-neon-gold/40 dark:text-neon-gold"
      titleGradientClassName="via-[#c58b2f] to-[#8a551a] dark:via-[#ffe6b3] dark:to-neon-gold"
      cardClassName="border-[#ccd9e5] bg-[#f5f8fc]/96 shadow-[0_28px_62px_-44px_rgba(58,116,159,0.4)] dark:border-sky-300/25 dark:bg-[#060d14]/65 dark:shadow-[0_30px_75px_-45px_rgba(56,189,248,0.7)]"
      backgroundGradientClassName="from-[#f7fbff] via-[#edf5ff] to-[#f8fbff] dark:from-[#05070d] dark:via-[#081827] dark:to-[#05070d]"
      topGlowClassName="bg-sky-400/7 dark:bg-sky-400/14"
      leftGlowClassName="bg-cyan-300/7 dark:bg-cyan-300/12"
      rightGlowClassName="bg-indigo-400/7 dark:bg-indigo-400/12"
      link={{
        href: "/reviews",
        label: "View All Reviews",
      }}
    >
      {reviews.length === 0 ? (
        <Card className="border border-[#d8e0e8] bg-[#f7fbff] backdrop-blur-sm dark:border-dark-border dark:bg-black/55">
          <CardContent className="py-8 text-center text-[#4f5a63] dark:text-[#a0a0a0]">
            No recent reviews available right now. Check back in a bit.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => {
            const images = resolveMediaUrls(review.images);
            const rating = Number.isFinite(review.rating) ? review.rating : 0;

            return (
              <MenuDishCard
                key={review.id}
                id={review.dish.id}
                name={review.dish.name}
                restaurantName={review.restaurant.name}
                imageUrl={images[0]}
                rating={rating}
                reviews={review.likes.length}
                badgeText={`By ${review.user.name}`}
                href={`/dishes/${review.dish.id}`}
                tone={index % 2 === 0 ? "rose" : "mint"}
                priceContextLabel={`Reviewed on ${formatReviewDate(review.createdAt)}`}
                mode="auto"
              />
            );
          })}
        </div>
      )}
    </HomeSectionFrame>
  );
}
