import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#09070a] via-[#24070f] to-[#09070a]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-56 w-132 -translate-x-1/2 rounded-full bg-neon-pink/18 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-black/45 px-6 py-12 text-center shadow-[0_30px_80px_-42px_rgba(255,94,146,0.45)] backdrop-blur-sm sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-neon-orange/18 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 bottom-2 h-44 w-44 rounded-full bg-neon-pink/20 blur-2xl"
          />

          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-neon-pink/35 bg-neon-pink/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd0e8]">
            <Sparkles className="h-3.5 w-3.5 text-neon-gold" />
            Join The Community
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-5xl">
            Ready to share your
            <span className="text-neon-gold"> food story</span>?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#b7b7c2] sm:text-base">
            Publish your first review in minutes, help others find the best spots, and build your trusted foodie profile.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="btn-neon-primary h-11 rounded-full px-6">
              <Link href="/signup" className="inline-flex items-center gap-2">
                Create Your Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="btn-outline-neon h-11 rounded-full px-6">
              <Link href="/reviews">Browse Community Reviews</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
