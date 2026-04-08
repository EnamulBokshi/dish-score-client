import Link from "next/link";
import { ArrowRight, MessageCircle, Store, Star, UtensilsCrossed } from "lucide-react";

import ConsumerLikesChart from "@/components/modules/stats/charts/ConsumerLikesChart";
import DashboardStatsCard from "@/components/modules/stats/DashboardStatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guestDashboardStats, guestDishes, guestRestaurants, guestReviews } from "@/lib/guestDashboardData";

const quickActions = [
	{ label: "Browse Restaurants", href: "/guest-dashboard/restaurants" },
	{ label: "Explore Dishes", href: "/guest-dashboard/dishes" },
	{ label: "My Reviews", href: "/guest-dashboard/my-reviews" },
	{ label: "Review Stats", href: "/guest-dashboard/review-stats" },
];

export default function GuestDashboardPage() {
	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-[#e1d2c7] bg-gradient-to-br from-[#fff8f3] via-[#fffaf7] to-[#f8f1ea] p-6 shadow-[0_24px_52px_-38px_rgba(132,91,70,0.36)] dark:border-white/10 dark:from-[#171019] dark:via-[#110d13] dark:to-[#09070a]">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-3xl space-y-3">
						<p className="inline-flex items-center gap-2 rounded-full border border-[#e2cbbf] bg-[#fff3e7] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b5d33] dark:border-white/10 dark:bg-white/5 dark:text-neon-gold">
							<MessageCircle className="h-3.5 w-3.5 text-neon-orange" />
							Demo Mode
						</p>
						<h1 className="text-3xl font-bold leading-tight text-[#2d201a] dark:text-white sm:text-4xl">
							Welcome, Guest Explorer
						</h1>
						<p className="max-w-2xl text-sm leading-7 text-[#68574e] dark:text-[#b9b2bd] sm:text-base">
							This is a fully loaded guest preview of the consumer dashboard. Browse dummy restaurants, dishes, reviews, and stats without signing in.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<Link href="/login" className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dcc3b6] bg-white px-5 text-sm font-semibold text-[#6a4b40] transition hover:bg-[#f8ece6] dark:border-white/10 dark:bg-white/5 dark:text-[#f3e7e0] dark:hover:bg-white/10">
							Sign In
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<DashboardStatsCard title="Reviews Written" value={guestDashboardStats.totalReviewsWritten} iconName="MessageCircle" />
				<DashboardStatsCard title="Total Likes" value={guestDashboardStats.totalLikes} iconName="ThumbsUp" />
				<DashboardStatsCard title="Available Dishes" value={guestDashboardStats.totalDishes} iconName="Utensils" />
				<DashboardStatsCard title="Restaurants" value={guestDashboardStats.totalRestaurants} iconName="Store" />
			</div>

			<ConsumerLikesChart data={guestDashboardStats.likeWiseReviews} />

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{quickActions.map((item) => (
					<Card key={item.href} className="border-border bg-card/85 transition-colors hover:border-neon-orange/50">
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

			<div className="grid gap-4 lg:grid-cols-2">
				<Card className="border-border bg-card/85">
					<CardHeader>
						<CardTitle className="text-base text-foreground">Popular Restaurants in Demo</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{guestRestaurants.slice(0, 3).map((restaurant) => (
							<div key={restaurant.id} className="rounded-xl border border-border bg-background/60 p-4">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="font-semibold text-foreground">{restaurant.name}</p>
										<p className="text-sm text-muted-foreground">{restaurant.city}, {restaurant.state}</p>
									</div>
									<p className="text-sm font-semibold text-neon-gold">{restaurant.ratingAvg.toFixed(1)} ★</p>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">{restaurant.description}</p>
							</div>
						))}
					</CardContent>
				</Card>

				<Card className="border-border bg-card/85">
					<CardHeader>
						<CardTitle className="text-base text-foreground">Recent Guest Reviews</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{guestReviews.slice(0, 3).map((review) => (
							<div key={review.id} className="rounded-xl border border-border bg-background/60 p-4">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="font-semibold text-foreground">{review.restaurantName}</p>
										<p className="text-sm text-muted-foreground">{review.dishName}</p>
									</div>
									<p className="text-sm font-semibold text-neon-gold">{review.rating}/5</p>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<Card className="border-dashed border-border bg-card/70">
				<CardContent className="p-5 text-sm text-muted-foreground">
					This guest dashboard mirrors the consumer experience using dummy data so you can explore the product without an account.
				</CardContent>
			</Card>
		</section>
	);
}