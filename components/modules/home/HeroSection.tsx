import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-8 h-56 w-xl -translate-x-1/2 rounded-full bg-neon-orange/15 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute right-0 top-24 h-44 w-44 rounded-full bg-neon-gold/10 blur-2xl"
			/>

			<div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center fade-in">
				<p className="mb-5 inline-flex rounded-full border border-neon-orange/40 bg-dark-card/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-neon-gold">
					Honest dish-by-dish ratings
				</p>

				<h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
					Share your food story.
					<br />
					<span className="text-neon-orange">Find trusted reviews</span> before your next meal.
				</h1>

				<p className="mt-6 max-w-2xl text-base leading-7 text-[#a0a0a0] sm:text-lg">
					Dish Score helps real diners review dishes, not just restaurants. Discover what to order, what to skip,
					and where your taste fits best.
				</p>

				<div className="mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:justify-center slide-up">
					<Button asChild size="lg" className="btn-neon-primary w-full sm:w-auto">
						<Link href="/signup">Become a Reviewer</Link>
					</Button>
					<Button asChild size="lg" className="btn-outline-neon w-full sm:w-auto">
						<Link href="/reviews">Browse Reviews</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
