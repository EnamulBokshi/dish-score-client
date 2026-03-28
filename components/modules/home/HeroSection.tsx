import Link from "next/link";
import { ArrowRight, Flame, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTrendingDishes } from "@/services/dish.services";

type HeroDish = {
	id: string;
	name: string;
	restaurantName: string;
	ratingLabel: string;
	reviewsLabel: string;
	imageSrc?: string;
};

const heroCardPattern = ["lg:-translate-y-6", "lg:translate-y-2", "lg:translate-y-8", "lg:-translate-y-1"];

function toRatingLabel(value?: number): string {
	if (typeof value !== "number") {
		return "New";
	}

	return value.toFixed(1);
}

function toReviewsLabel(value?: number): string {
	if (typeof value !== "number" || value < 1) {
		return "No reviews yet";
	}

	return `${value} reviews`;
}

function resolveDishImageSrc(image?: string): string | undefined {
	if (!image || image.trim().length === 0) {
		return undefined;
	}

	if (image.startsWith("http://") || image.startsWith("https://")) {
		return image;
	}

	const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	if (!apiBaseUrl) {
		return image;
	}

	const normalizedBase = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
	const normalizedImage = image.startsWith("/") ? image : `/${image}`;

	return `${normalizedBase}${normalizedImage}`;
}

function toHeroDish(dish: Awaited<ReturnType<typeof getTrendingDishes>>[number]): HeroDish {
	return {
		id: dish.id,
		name: dish.name,
		restaurantName: dish.restaurant?.name || "Community Pick",
		ratingLabel: toRatingLabel(dish.ratingAvg),
		reviewsLabel: toReviewsLabel(dish.totalReviews),
		imageSrc: resolveDishImageSrc(dish.image),
	};
}

export default async function HeroSection() {
	const dishes = await getTrendingDishes();
	const heroDishes = dishes.slice(0, 4).map(toHeroDish);

	return (
		<section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 lg:px-8">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-55"
				style={{
					backgroundImage:
						"radial-gradient(circle at 18% 12%, rgba(255, 0, 64, 0.2), transparent 30%), radial-gradient(circle at 84% 20%, rgba(255, 87, 34, 0.25), transparent 28%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
					backgroundSize: "100% 100%, 100% 100%, 50px 50px, 50px 50px",
					backgroundAttachment: "fixed",
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-8 h-64 w-152 -translate-x-1/2 rounded-full bg-neon-orange/20 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -right-24 top-28 h-64 w-64 rounded-full bg-neon-pink/20 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute bottom-4 -left-20 h-56 w-56 rounded-full bg-neon-gold/10 blur-3xl"
			/>

			<div className="relative mx-auto w-full max-w-7xl">
				<div className="mx-auto flex max-w-4xl flex-col items-center text-center fade-in">
					<p className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-orange/40 bg-black/50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-neon-gold backdrop-blur-sm">
						<Flame className="h-3.5 w-3.5 text-neon-orange" />
						Trending Now
					</p>

					<h1 className="max-w-5xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
						The hottest dishes,
						<br />
						<span className="bg-linear-to-r from-neon-pink via-neon-orange to-neon-gold bg-clip-text text-transparent">
							ranked by real diners.
						</span>
					</h1>

					<p className="mt-6 max-w-2xl text-base leading-7 text-[#b8b8c2] sm:text-lg">
						Find what is worth ordering before you visit. Discover top-rated dishes with restaurant context,
						community scores, and fresh review trends.
					</p>

					<div className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center slide-up">
						<Button asChild size="lg" className="btn-neon-primary w-full sm:w-auto">
							<Link href="/signup" className="inline-flex items-center gap-2">
								Become a Reviewer <ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button asChild size="lg" className="btn-outline-neon w-full sm:w-auto">
							<Link href="/review">Browse Reviews</Link>
						</Button>
					</div>
				</div>

				<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{heroDishes.length === 0
						? ["No dishes yet", "Awaiting ratings", "Community picks", "Fresh updates"].map((label) => (
								<article
									key={label}
									className="rounded-3xl border border-dark-border/80 bg-black/45 px-5 pb-5 pt-14 text-center backdrop-blur-sm"
								>
									<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-neon-orange/40 bg-linear-to-br from-neon-orange/20 to-neon-pink/20 text-sm font-semibold text-neon-gold">
										{label}
									</div>
									<p className="text-sm text-[#a0a0a0]">Trending dishes will appear here soon.</p>
								</article>
							))
						: heroDishes.map((dish, index) => (
								<article
									key={dish.id}
									className={`rounded-3xl border border-dark-border/80 bg-black/50 px-5 pb-5 pt-14 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neon-orange/55 hover:shadow-neon-glow ${heroCardPattern[index % heroCardPattern.length]}`}
								>
									<div className="mx-auto -mt-20 mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-neon-gold/50 bg-dark-card shadow-neon-glow-gold">
										{dish.imageSrc ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={dish.imageSrc}
												alt={dish.name}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neon-orange/30 via-neon-pink/20 to-neon-gold/30 text-2xl font-bold text-neon-gold">
												{dish.name.charAt(0)}
											</div>
										)}
									</div>

									<p className="text-xs uppercase tracking-[0.2em] text-neon-gold/80">Top Dish #{index + 1}</p>
									<h3 className="mt-2 line-clamp-1 text-lg font-semibold text-white">{dish.name}</h3>
									<p className="mt-1 line-clamp-1 text-sm text-[#a0a0a0]">{dish.restaurantName}</p>
									<div className="mt-4 flex items-center justify-center gap-2 text-sm">
										<Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
										<span className="font-semibold text-neon-orange">{dish.ratingLabel}</span>
										<span className="text-[#8e8ea0]">{dish.reviewsLabel}</span>
									</div>
								</article>
							))}
				</div>
			</div>
		</section>
	);
}
