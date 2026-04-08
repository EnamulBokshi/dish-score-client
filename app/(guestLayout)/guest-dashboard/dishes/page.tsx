import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guestDishes } from "@/lib/guestDashboardData";

export default function GuestDishesPage() {
	return (
		<section className="space-y-5">
			<div>
				<h1 className="text-2xl font-bold text-foreground md:text-3xl">Guest Dishes</h1>
				<p className="mt-2 text-sm text-muted-foreground md:text-base">Explore demo dishes that reflect the kind of feedback users leave on the platform.</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{guestDishes.map((dish) => (
					<Card key={dish.id} className="border-border bg-card/85">
						<CardHeader>
							<div className="flex items-start justify-between gap-3">
								<div>
									<CardTitle className="text-lg text-foreground">{dish.name}</CardTitle>
									<p className="mt-1 text-sm text-muted-foreground">{dish.restaurantName}</p>
								</div>
								<Badge variant="secondary">{dish.ratingAvg.toFixed(1)} ★</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground">{dish.description}</p>
							<div className="flex flex-wrap gap-2">
								{dish.tags?.map((tag) => (
									<Badge key={tag} variant="outline">#{tag}</Badge>
								))}
							</div>
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>${dish.price.toFixed(2)}</span>
								<span>{dish.totalReviews} demo reviews</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}