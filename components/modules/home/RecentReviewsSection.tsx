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
      badgeClassName="border-neon-gold/40"
      titleGradientClassName="via-[#ffe6b3] to-neon-gold"
      cardClassName="border-sky-300/25 bg-[#060d14]/65 shadow-[0_30px_75px_-45px_rgba(56,189,248,0.7)]"
      backgroundGradientClassName="from-[#05070d] via-[#081827] to-[#05070d]"
      topGlowClassName="bg-sky-400/14"
      leftGlowClassName="bg-cyan-300/12"
      rightGlowClassName="bg-indigo-400/12"
    >
      {reviews.length === 0 ? (
        <Card className="border border-dark-border bg-black/55 backdrop-blur-sm">
          <CardContent className="py-8 text-center text-[#a0a0a0]">
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
                mode="dark"
              />
            );
          })}
        </div>
      )}
    </HomeSectionFrame>
  );
}
