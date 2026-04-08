import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { guestReviews } from "@/lib/guestDashboardData";

function formatDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "Recently";
	}

	return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function GuestMyReviewsPage() {
	return (
		<section className="space-y-5">
			<div>
				<h1 className="text-2xl font-bold text-foreground md:text-3xl">Guest Reviews</h1>
				<p className="mt-2 text-sm text-muted-foreground md:text-base">These are sample reviews to showcase the consumer experience in demo mode.</p>
			</div>

			<div className="space-y-4">
				{guestReviews.map((review) => (
					<Card key={review.id} className="border-border bg-card/85">
						<CardHeader>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<CardTitle className="text-lg text-foreground">{review.restaurantName}</CardTitle>
									<p className="mt-1 text-sm text-muted-foreground">{review.dishName} • by {review.userName}</p>
								</div>
								<Badge variant="secondary">{review.rating}/5</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground">{review.comment}</p>
							<div className="flex items-center justify-between text-xs text-muted-foreground">
								<span>{formatDate(review.createdAt)}</span>
								<span>{review.likes} likes</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}