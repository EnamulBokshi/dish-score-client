import DashboardStatsCard from "@/components/modules/stats/DashboardStatsCard";
import MonthlyTrendChart from "@/components/modules/stats/charts/MonthlyTrendChart";
import RatingDistributionChart from "@/components/modules/stats/charts/RatingDistributionChart";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/services/stats.services";
import { IAdminDashboardStats } from "@/types/dashboard.type";

export default async function AdminDashboardPanel() {
  const stats = await getDashboardStats<IAdminDashboardStats>();

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
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Admin Analytics Hub</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Track user growth, review velocity, and quality distribution across restaurants and dishes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardStatsCard title="Total Reviews" value={stats.totalReviews} iconName="MessageSquareText" />
        <DashboardStatsCard title="Total Restaurants" value={stats.totalRestaurants} iconName="Store" />
        <DashboardStatsCard title="Consumers" value={stats.userStats.totalConsumer} iconName="Users" />
        <DashboardStatsCard title="Owners" value={stats.userStats.totalOwner} iconName="UserRoundCog" />
        <DashboardStatsCard title="Admins" value={stats.userStats.totalAdmin} iconName="Shield" />
        <DashboardStatsCard
          title="Super Admins"
          value={stats.userStats.totalSuperAdmin}
          iconName="ShieldCheck"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <RatingDistributionChart
          title="Restaurant Rating Distribution"
          description="How restaurants are distributed by rounded average rating."
          data={stats.ratingWiseRestaurantBarChart}
        />
        <RatingDistributionChart
          title="Dish Rating Distribution"
          description="How dishes are distributed by rounded average rating."
          data={stats.ratingWiseDishBarChart}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <MonthlyTrendChart
          title="Monthly Review Creations"
          description="Number of reviews created each month."
          data={stats.monthlyReviewCreations}
          color="oklch(0.66 0.2 42)"
        />
        <MonthlyTrendChart
          title="Monthly User Registrations"
          description="Number of new user registrations each month."
          data={stats.monthlyUserRegistration}
          color="oklch(0.62 0.16 258)"
        />
      </div>
    </section>
  );
}
