import Link from "next/link";

import DashboardStatsCard from "@/components/modules/stats/DashboardStatsCard";
import ConsumerLikesChart from "@/components/modules/stats/charts/ConsumerLikesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/services/stats.services";
import { IConsumerDashboardStats } from "@/types/dashboard.type";

const quickLinks = [
  { label: "Browse Restaurants", href: "/dashboard/restaurants" },
  { label: "Explore Dishes", href: "/dashboard/dishes" },
  { label: "My Reviews", href: "/dashboard/my-reviews" },
];

export default async function ConsumerDashboardPage() {
  const stats = await getDashboardStats<IConsumerDashboardStats>();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Welcome to your <span className="text-neon-orange">Dashboard</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Jump back into your food journey with quick access to restaurants, dishes, and your reviews.
        </p>
      </div>

      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardStatsCard title="Reviews Written" value={stats.totalReviewsWritten} iconName="MessageCircle" />
            <DashboardStatsCard title="Total Likes" value={stats.totalLikes} iconName="ThumbsUp" />
            <DashboardStatsCard title="Available Dishes" value={stats.totalDishes} iconName="Utensils" />
            <DashboardStatsCard title="Restaurants" value={stats.totalRestaurants} iconName="Store" />
          </div>

          <ConsumerLikesChart data={stats.likeWiseReviews} />
        </>
      ) : (
        <Card className="border-dashed border-muted bg-card/60">
          <CardContent className="py-8 text-center text-muted-foreground">
            Unable to load personalized stats right now.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <Card key={item.href} className="border-dark-border bg-card/80 transition-colors hover:border-neon-orange/50">
            <CardHeader>
              <CardTitle className="text-base text-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={item.href} className="text-sm font-medium text-neon-gold hover:text-neon-orange">
                Open
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
