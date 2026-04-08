import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guestRestaurants } from "@/lib/guestDashboardData";

export default function GuestRestaurantsPage() {
	return (
		<section className="space-y-5">
			<div>
				<h1 className="text-2xl font-bold text-foreground md:text-3xl">Guest Restaurants</h1>
				<p className="mt-2 text-sm text-muted-foreground md:text-base">A demo list of highly rated restaurants from the consumer dashboard.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{guestRestaurants.map((restaurant) => (
					<Card key={restaurant.id} className="border-border bg-card/85">
						<CardHeader>
							<div className="flex items-start justify-between gap-3">
								<div>
									<CardTitle className="text-lg text-foreground">{restaurant.name}</CardTitle>
									<p className="mt-1 text-sm text-muted-foreground">{restaurant.city}, {restaurant.state}</p>
								</div>
								<Badge variant="secondary">{restaurant.ratingAvg.toFixed(1)} ★</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground">{restaurant.description}</p>
							<div className="flex flex-wrap gap-2">
								{restaurant.tags?.map((tag) => (
									<Badge key={tag} variant="outline">#{tag}</Badge>
								))}
							</div>
							<p className="text-xs text-muted-foreground">{restaurant.totalReviews} guest reviews in the demo</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}