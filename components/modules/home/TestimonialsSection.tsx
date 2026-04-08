import { MessageSquareQuote } from "lucide-react";

import TestimonialsCarousel from "@/components/modules/home/TestimonialsCarousel";
import { getHomeTestimonials } from "@/services/testimonial.services";
import { getUserInfo } from "@/services/auth.services";

export default async function TestimonialsSection() {
	const [userInfo, testimonials] = await Promise.all([getUserInfo(), getHomeTestimonials()]);
	const isLoggedIn = Boolean(userInfo?.id);

	return (
		<section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#fffaf6] via-[#fff6ef] to-[#fffaf6] dark:from-[#05070d] dark:via-[#0d0b12] dark:to-[#05070d]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-4 h-52 w-[34rem] -translate-x-1/2 rounded-full bg-neon-orange/6 blur-3xl dark:bg-neon-orange/10"
			/>

			<div className="relative mx-auto w-full max-w-7xl">
				<div className="mx-auto max-w-4xl text-center">
					<p className="inline-flex items-center gap-2 rounded-full border border-[#e6cdbf] bg-[#fff4ea] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#8d5b31] dark:border-white/10 dark:bg-white/5 dark:text-neon-gold">
						<MessageSquareQuote className="h-3.5 w-3.5 text-neon-orange" />
						Community Spotlight
					</p>

					<h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
						<span className="bg-linear-to-r from-[#2a1c17] via-[#9a5a2f] to-[#c87c1f] bg-clip-text text-transparent dark:from-white dark:via-[#ffd5b9] dark:to-neon-gold">
							What People Say About Our Platform
						</span>
					</h2>

					<p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#66564d] dark:text-[#b9b2bd] sm:text-base">
						Real diners, honest reactions, and quick stories from the Dish Score community. The section stays lightweight so the voices stand out.
					</p>
				</div>

				<div className="mt-10">
					<TestimonialsCarousel testimonials={testimonials} isLoggedIn={isLoggedIn} />
				</div>
			</div>
		</section>
	);
}