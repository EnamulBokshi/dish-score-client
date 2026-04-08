"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import TestimonialFeedbackDialog from "@/components/modules/home/TestimonialFeedbackDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ITestimonial } from "@/types/testimonial.types";

interface TestimonialsCarouselProps {
	testimonials: ITestimonial[];
	isLoggedIn: boolean;
}

const AUTOPLAY_THRESHOLD = 3;

const DUMMY_TESTIMONIALS: ITestimonial[] = [
	{
		id: "dummy-testimonial-1",
		title: "Helpful and easy to trust",
		feedback:
			"Dish Score makes it simple to discover places that actually deliver on taste, service, and consistency. The reviews feel honest and practical.",
		rating: 5,
		userId: "dummy-user-1",
		createdAt: "2026-04-01T10:00:00.000Z",
		updatedAt: "2026-04-01T10:00:00.000Z",
		user: {
			id: "dummy-user-1",
			name: "Amina Rahman",
			email: "",
			role: undefined,
			profilePhoto: null,
			image: null,
		},
	},
	{
		id: "dummy-testimonial-2",
		title: "A better way to decide what to eat",
		feedback:
			"I like that the platform keeps restaurant and dish feedback organized. It saves me from guessing and helps me pick with confidence.",
		rating: 4,
		userId: "dummy-user-2",
		createdAt: "2026-04-03T15:30:00.000Z",
		updatedAt: "2026-04-03T15:30:00.000Z",
		user: {
			id: "dummy-user-2",
			name: "Daniel Carter",
			email: "",
			role: undefined,
			profilePhoto: null,
			image: null,
		},
	},
	{
		id: "dummy-testimonial-3",
		title: "Feels built for real diners",
		feedback:
			"The experience feels focused and friendly. It’s easy to browse, compare, and share opinions without the page feeling noisy.",
		rating: 5,
		userId: "dummy-user-3",
		createdAt: "2026-04-05T08:45:00.000Z",
		updatedAt: "2026-04-05T08:45:00.000Z",
		user: {
			id: "dummy-user-3",
			name: "Sophia Lee",
			email: "",
			role: undefined,
			profilePhoto: null,
			image: null,
		},
	},
];

function formatDate(dateValue: string): string {
	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) {
		return "Recently";
	}

	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function getFallbackInitial(name?: string): string {
	return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function getRoleLabel(role?: string): string {
	if (!role) {
		return "Community member";
	}

	return role.toLowerCase().replace(/_/g, " ");
}

function RatingStars({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
			{Array.from({ length: 5 }, (_, index) => {
				const starValue = index + 1;
				const active = rating >= starValue;

				return (
					<Star
						key={starValue}
						className={active ? "h-4 w-4 fill-neon-gold text-neon-gold" : "h-4 w-4 text-[#d6c9c1] dark:text-[#4b4046]"}
					/>
				);
			})}
		</div>
	);
}

export default function TestimonialsCarousel({ testimonials, isLoggedIn }: TestimonialsCarouselProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
	const autoplayRef = useRef<number | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(1);
	const [isPaused, setIsPaused] = useState(false);
	const displayTestimonials = testimonials.length > 0 ? testimonials : DUMMY_TESTIMONIALS;

	const canAutoplay = displayTestimonials.length > AUTOPLAY_THRESHOLD;
	const maxIndex = Math.max(0, displayTestimonials.length - visibleCount);

	useEffect(() => {
		function updateVisibleCount() {
			if (window.innerWidth >= 1024) {
				setVisibleCount(3);
				return;
			}

			if (window.innerWidth >= 640) {
				setVisibleCount(2);
				return;
			}

			setVisibleCount(1);
		}

		updateVisibleCount();
		window.addEventListener("resize", updateVisibleCount);

		return () => {
			window.removeEventListener("resize", updateVisibleCount);
		};
	}, []);

	useEffect(() => {
		if (activeIndex > maxIndex) {
			setActiveIndex(maxIndex);
		}
	}, [activeIndex, maxIndex]);

	const scrollToIndex = (index: number) => {
		const normalizedIndex = Math.max(0, Math.min(index, maxIndex));
		const card = cardRefs.current[normalizedIndex];

		if (card) {
			card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
		}

		setActiveIndex(normalizedIndex);
	};

	const handleScroll = () => {
		const container = containerRef.current;
		if (!container || testimonials.length === 0) {
			return;
		}

		let closestIndex = 0;
		let closestDistance = Number.POSITIVE_INFINITY;

		cardRefs.current.forEach((card, index) => {
			if (!card) {
				return;
			}

			const distance = Math.abs(card.offsetLeft - container.scrollLeft);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		});

		setActiveIndex(closestIndex);
	};

	useEffect(() => {
		if (!canAutoplay || isPaused || displayTestimonials.length <= visibleCount) {
			if (autoplayRef.current !== null) {
				window.clearInterval(autoplayRef.current);
				autoplayRef.current = null;
			}
			return;
		}

		autoplayRef.current = window.setInterval(() => {
			setActiveIndex((current) => {
				const nextIndex = current >= maxIndex ? 0 : current + 1;
				requestAnimationFrame(() => scrollToIndex(nextIndex));
				return nextIndex;
			});
		}, 4500);

		return () => {
			if (autoplayRef.current !== null) {
				window.clearInterval(autoplayRef.current);
				autoplayRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [canAutoplay, displayTestimonials.length, isPaused, maxIndex, visibleCount]);

	const paginationDots = useMemo(() => {
		return Array.from({ length: maxIndex + 1 }, (_, index) => index);
	}, [maxIndex]);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<p className="max-w-3xl text-sm leading-6 text-[#66554b] dark:text-[#b9b2bd]">
					Browse real feedback from the community. The carousel moves automatically when there are enough testimonials, and you can pause it anytime.
				</p>

				<div className="flex items-center gap-3">
					{isLoggedIn ? (
						<TestimonialFeedbackDialog />
					) : (
						<Button asChild variant="outline" className="h-10 rounded-full border-[#dcc6bb] bg-white text-[#6b4a3f] hover:bg-[#f8ece6] dark:border-white/10 dark:bg-white/5 dark:text-[#f1e3dd] dark:hover:bg-white/10">
							<Link href="/login?redirect=/">Log in to share feedback</Link>
						</Button>
					)}
				</div>
			</div>

			<div
				className="relative"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
				onFocusCapture={() => setIsPaused(true)}
				onBlurCapture={() => setIsPaused(false)}
			>
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-linear-to-r from-[#fffaf6] to-transparent dark:from-[#05070d] lg:block" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-linear-to-l from-[#fffaf6] to-transparent dark:from-[#05070d] lg:block" />

				<button
					type="button"
					onClick={() => scrollToIndex(activeIndex === 0 ? maxIndex : activeIndex - 1)}
					className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8c1b4] bg-white/95 text-[#6f5347] shadow-lg transition hover:border-[#b77748] hover:text-[#a65a1d] dark:border-white/10 dark:bg-black/70 dark:text-[#eee3de] dark:hover:border-neon-orange/50 dark:hover:text-neon-orange sm:inline-flex"
					aria-label="Show previous testimonials"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>

				<button
					type="button"
					onClick={() => scrollToIndex(activeIndex >= maxIndex ? 0 : activeIndex + 1)}
					className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8c1b4] bg-white/95 text-[#6f5347] shadow-lg transition hover:border-[#b77748] hover:text-[#a65a1d] dark:border-white/10 dark:bg-black/70 dark:text-[#eee3de] dark:hover:border-neon-orange/50 dark:hover:text-neon-orange sm:inline-flex"
					aria-label="Show next testimonials"
				>
					<ChevronRight className="h-4 w-4" />
				</button>

				<div
					ref={containerRef}
					onScroll={handleScroll}
					className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{displayTestimonials.map((testimonial, index) => {
						const image = testimonial.user.profilePhoto || testimonial.user.image || "";
						const fallbackInitial = getFallbackInitial(testimonial.user.name);
						const title = testimonial.title?.trim() || "Community feedback";

						return (
							<div
								key={testimonial.id}
								ref={(node) => {
									cardRefs.current[index] = node;
								}}
								className="min-w-0 shrink-0 snap-start basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.75rem)]"
							>
								<div className="h-full rounded-2xl border border-[#e8d8ce] bg-white/80 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/95 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8">
									<div className="flex h-full flex-col gap-4">
										<div className="flex items-start gap-3">
											<Avatar className="h-11 w-11 border border-[#ead8ce] dark:border-white/10">
												<AvatarImage src={image} alt={testimonial.user.name} />
												<AvatarFallback className="bg-[#f6e8df] text-sm font-semibold text-[#8d533e] dark:bg-[#2b1d22] dark:text-[#ffd8bf]">
													{fallbackInitial}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-semibold text-[#2d1e19] dark:text-white">{testimonial.user.name}</p>
												<p className="truncate text-xs text-[#8a6f62] dark:text-[#aea6b0]">
													{getRoleLabel(testimonial.user.role)}
												</p>
											</div>
											<RatingStars rating={Number(testimonial.rating) || 0} />
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2 text-[#b46a1f] dark:text-neon-gold">
												<Quote className="h-4 w-4" />
												<p className="text-xs font-semibold uppercase tracking-[0.16em]">Testimonial</p>
											</div>
											<h3 className="text-lg font-semibold leading-tight text-[#2f1f19] dark:text-white">{title}</h3>
											<p className="text-sm leading-6 text-[#5f5148] dark:text-[#c7c0cb]">{testimonial.feedback}</p>
										</div>

										<div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eee0d7] pt-4 text-xs text-[#8a6f62] dark:border-white/10 dark:text-[#aba2af]">
											<span>{formatDate(testimonial.createdAt)}</span>
											<span>
												{index + 1} / {displayTestimonials.length}
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2 pt-1">
				{paginationDots.map((index) => {
					const active = index === activeIndex;

					return (
						<button
							key={`testimonial-dot-${index}`}
							type="button"
							onClick={() => scrollToIndex(index)}
							className={
								active
									? "h-2.5 w-8 rounded-full bg-[#b96a24] transition dark:bg-neon-gold"
									: "h-2.5 w-2.5 rounded-full bg-[#d8c7bd] transition hover:bg-[#b96a24] dark:bg-white/20 dark:hover:bg-neon-gold"
							}
							aria-label={`Go to testimonial ${index + 1}`}
						/>
					);
				})}
			</div>
		</div>
	);
}