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

const heroCardPattern = ["lg:-translate-y-6", "lg:translate-y-2", "lg:translate-y-8", "lg:-translate-y-6"];

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
		<section
			className="px-4 pb-8 pt-6 sm:px-6 lg:px-8"
			style={{ background: "#d4d0c8", fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
		>
			<div className="mx-auto w-full max-w-7xl">
				{/* Win2K window panel */}
				<div className="win-panel mb-4">
					{/* Title bar */}
					<div
						className="win-titlebar flex items-center gap-2 px-2 py-1 select-none"
						style={{ background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)" }}
					>
						<Flame className="h-3 w-3 text-yellow-300" aria-hidden />
						<span className="font-bold text-[11px] text-white">Trending Now — Dish Score v1.0</span>
					</div>

					{/* Content area */}
					<div className="p-4">
						<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
							<h1
								className="text-[22px] font-bold leading-tight text-[#0a246a]"
								style={{ fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
							>
								The hottest dishes,{" "}
								<span className="text-[#cc0000]">ranked by real diners.</span>
							</h1>

							<p className="mt-2 max-w-xl text-[11px] leading-5 text-[#333333]">
								Find what is worth ordering before you visit. Discover top-rated dishes with restaurant context,
								community scores, and fresh review trends.
							</p>

							<div className="mt-4 flex flex-wrap justify-center gap-2">
								<Link
									href="/signup"
									className="btn-win-primary inline-flex items-center gap-1 px-4 py-1 text-[11px] font-bold"
									style={{
										background: "#d4d0c8",
										border: "1px solid #000000",
										borderTop: "2px solid #ffffff",
										borderLeft: "2px solid #ffffff",
										borderRight: "2px solid #404040",
										borderBottom: "2px solid #404040",
										boxShadow: "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080",
									}}
								>
									Become a Reviewer <ArrowRight className="h-3 w-3" />
								</Link>
								<Link
									href="/reviews"
									className="btn-win inline-flex items-center gap-1 px-4 py-1 text-[11px]"
								>
									Browse Reviews
								</Link>
							</div>
						</div>

						{/* Dish cards */}
						<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							{heroDishes.length === 0
								? ["No dishes yet", "Awaiting ratings", "Community picks", "Fresh updates"].map((label) => (
										<div
											key={label}
											className="win-sunken p-3 text-center text-[11px] text-[#666666]"
										>
											{label}
										</div>
									))
								: heroDishes.map((dish, index) => (
										<article
											key={dish.id}
											className="win-raised overflow-hidden"
										>
											{/* Mini titlebar */}
											<div
												className="px-2 py-0.5 text-[10px] font-bold text-white"
												style={{ background: "linear-gradient(to right, #0a246a, #4872c4)" }}
											>
												Top Dish #{index + 1}
											</div>
											<div className="p-3">
												{/* Image */}
												<div
													className="mb-2 mx-auto overflow-hidden"
													style={{
														width: "72px",
														height: "72px",
														border: "2px solid #808080",
														borderTop: "2px solid #404040",
														borderLeft: "2px solid #404040",
														borderRight: "2px solid #ffffff",
														borderBottom: "2px solid #ffffff",
													}}
												>
													{dish.imageSrc ? (
														// eslint-disable-next-line @next/next/no-img-element
														<img
															src={dish.imageSrc}
															alt={dish.name}
															className="h-full w-full object-cover"
														/>
													) : (
														<div
															className="flex h-full w-full items-center justify-center text-[20px] font-bold text-[#0a246a]"
															style={{ background: "#ece9d8" }}
														>
															{dish.name.charAt(0)}
														</div>
													)}
												</div>
												<h3 className="line-clamp-1 text-[11px] font-bold text-[#000000]">{dish.name}</h3>
												<p className="line-clamp-1 text-[10px] text-[#444444]">{dish.restaurantName}</p>
												<div className="mt-2 flex items-center gap-1 text-[10px]">
													<Star className="h-3 w-3 fill-[#cc8800] text-[#cc8800]" />
													<span className="font-bold text-[#cc0000]">{dish.ratingLabel}</span>
													<span className="text-[#666666]">{dish.reviewsLabel}</span>
												</div>
											</div>
										</article>
									))}
						</div>
					</div>

					{/* Win2K status bar */}
					<div
						className="flex items-center justify-between px-2 py-0.5 text-[10px] text-[#444444]"
						style={{
							background: "#d4d0c8",
							borderTop: "1px solid #808080",
						}}
					>
						<span>Done</span>
						<span className="win-sunken px-2">&#127760; Internet</span>
					</div>
				</div>
			</div>
		</section>
	);
}
