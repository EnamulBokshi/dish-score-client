import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#fff8f3] via-[#fdeee8] to-[#fff8f3] dark:from-[#09070a] dark:via-[#24070f] dark:to-[#09070a]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-56 w-132 -translate-x-1/2 rounded-full bg-neon-pink/8 blur-3xl dark:bg-neon-pink/18"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-[#e5cbc0] bg-[#fff9f5]/96 px-6 py-12 text-center shadow-[0_26px_56px_-38px_rgba(136,78,66,0.32)] backdrop-blur-sm sm:px-10 dark:border-white/12 dark:bg-black/45 dark:shadow-[0_30px_80px_-42px_rgba(255,94,146,0.45)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-neon-orange/10 blur-2xl dark:bg-neon-orange/18"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 bottom-2 h-44 w-44 rounded-full bg-neon-pink/10 blur-2xl dark:bg-neon-pink/20"
          />

          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#f1b8cf] bg-[#ffe8f2] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#914769] dark:border-neon-pink/35 dark:bg-neon-pink/12 dark:text-[#ffd3e4]">
            <Sparkles className="h-3.5 w-3.5 text-[#c58324] dark:text-[#ffd18f]" />
            Join The Community
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-[#2a1b16] sm:text-5xl dark:text-white">
            Ready to share your
            <span className="text-[#b56d1f] dark:text-[#ffd18f]"> food story</span>?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5b4b43] sm:text-base dark:text-[#b7b7c2]">
            Publish your first review in minutes, help others find the best spots, and build your trusted foodie profile.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 rounded-full bg-[#7c4f3f] px-6 text-white hover:bg-[#6a4235] dark:bg-neon-orange dark:text-[#1f130f] dark:hover:bg-[#ff8d61]"
            >
              <Link href="/signup" className="inline-flex items-center gap-2">
                Create Your Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-[#dcc3b7] bg-white text-[#6b4a3f] hover:bg-[#f8ece6] dark:border-neon-orange/40 dark:bg-transparent dark:text-neon-orange dark:hover:bg-neon-orange/12"
            >
              <Link href="/reviews">Browse Community Reviews</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
