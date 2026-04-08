import DashboardStatsCard from "@/components/modules/stats/DashboardStatsCard";
import ConsumerLikesChart from "@/components/modules/stats/charts/ConsumerLikesChart";
import { Card, CardContent } from "@/components/ui/card";
import { guestDashboardStats } from "@/lib/guestDashboardData";

export default function GuestReviewStatsPage() {
	return (
		<section className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-foreground md:text-3xl">Guest Review Stats</h1>
				<p className="mt-2 text-sm text-muted-foreground md:text-base">A preview of the types of insights consumer users see inside the dashboard.</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<DashboardStatsCard title="Reviews Written" value={guestDashboardStats.totalReviewsWritten} iconName="MessageCircle" />
				<DashboardStatsCard title="Total Likes" value={guestDashboardStats.totalLikes} iconName="ThumbsUp" />
				<DashboardStatsCard title="Available Dishes" value={guestDashboardStats.totalDishes} iconName="Utensils" />
				<DashboardStatsCard title="Restaurants" value={guestDashboardStats.totalRestaurants} iconName="Store" />
			</div>

			<ConsumerLikesChart data={guestDashboardStats.likeWiseReviews} />

			<Card className="border-dashed border-border bg-card/70">
				<CardContent className="p-5 text-sm text-muted-foreground">
					Guest mode uses static demo data so the dashboard still feels complete without an account.
				</CardContent>
			</Card>
		</section>
	);
}