import { MessageCircle, Star } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

function renderStars(rating: number) {
	return Array.from({ length: 5 }, (_, index) => {
		const filled = index < Math.round(rating);
		return (
			<Star
				key={`${rating}-${index}`}
				className={filled ? "h-4 w-4 fill-neon-gold text-neon-gold" : "h-4 w-4 text-[#5c5c6a]"}
			/>
		);
	});
}

function getCommentText(review: IRecentReview): string {
	return review.comment && review.comment.trim().length > 0
		? review.comment
		: "No written comment for this review yet.";
}

export default async function RecentReviewsSection() {
	const reviews = await getRecentReviews();

	return (
		<section className="px-4 pb-16 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-7xl">
				<div className="mb-8 flex items-start justify-between gap-4">
					<div>
						<h2 className="text-3xl font-bold sm:text-4xl">
							<span className="text-neon-gold">Recent</span> Reviews
						</h2>
						<p className="mt-3 max-w-2xl text-sm text-[#a0a0a0] sm:text-base">
							See what the community is saying right now. Fresh ratings and feedback from real diners across popular
							dishes.
						</p>
					</div>
					<div className="hidden rounded-full border border-neon-gold/40 bg-dark-card/70 p-2 text-neon-orange sm:block">
						<MessageCircle className="h-5 w-5" />
					</div>
				</div>

				{reviews.length === 0 ? (
					<Card className="border border-dark-border bg-dark-card/60">
						<CardContent className="py-8 text-center text-[#a0a0a0]">
							No recent reviews available right now. Check back in a bit.
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{reviews.map((review) => (
							<Card
								key={review.id}
								className="border border-dark-border bg-dark-card/80 transition-colors hover:border-neon-gold/50"
							>
								<CardHeader>
									<CardDescription className="text-[#9a9aa7]">
										{review.user.name} reviewed <span className="text-neon-orange">{review.dish.name}</span>
									</CardDescription>
									<CardTitle className="text-base text-white">{review.restaurant.name}</CardTitle>
								</CardHeader>

								<CardContent>
									<div className="mb-3 flex items-center gap-1">{renderStars(review.rating)}</div>
									<p className="text-sm leading-6 text-[#a0a0a0]">{getCommentText(review)}</p>
								</CardContent>

								<CardFooter className="justify-between border-dark-border bg-[#141418]">
									<p className="text-xs text-[#9a9aa7]">{formatReviewDate(review.createdAt)}</p>
									<p className="text-xs text-[#9a9aa7]">{review.likes.length} likes</p>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
