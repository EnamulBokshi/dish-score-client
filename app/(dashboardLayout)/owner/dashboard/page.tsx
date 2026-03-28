import DashboardStatsCard from "@/components/modules/stats/DashboardStatsCard";
import RatingDistributionChart from "@/components/modules/stats/charts/RatingDistributionChart";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/services/stats.services";
import { IOwnerDashboardStats } from "@/types/dashboard.type";

export default async function OwnerDashboardPanel() {
  const stats = await getDashboardStats<IOwnerDashboardStats>();

  if (!stats) {
    return (
      <Card className="border-dashed border-muted bg-card/60">
        <CardContent className="py-12 text-center text-muted-foreground">
          Unable to load dashboard stats right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Owner Performance Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Monitor your menu footprint and rating distribution at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardStatsCard title="Total Dishes" value={stats.totalDishes} iconName="Utensils" />
        <DashboardStatsCard
          title="Average Rating"
          value={Number(stats.avgRating || 0).toFixed(2)}
          iconName="Star"
          description="Across all dishes in your restaurants"
        />
      </div>

      <RatingDistributionChart
        title="Dish Ratings Distribution"
        description="Your dishes grouped by rounded average rating."
        data={stats.ratingWiseDishesBarChart}
      />
    </section>
  );
}
