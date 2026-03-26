import Link from "next/link";

import { Button } from "@/components/ui/button";

interface NotFoundProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function NotFound({
  title = "Page not found",
  description = "The page you are looking for does not exist or may have been moved.",
  ctaLabel = "Back to home",
  ctaHref = "/",
}: NotFoundProps) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,87,34,0.22),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,215,0,0.14),transparent_40%),linear-gradient(180deg,#0a0a0a,#111117)]" />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-2xl border border-dark-border bg-dark-card/70 p-8 text-center backdrop-blur md:p-12">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[#FFD700]">ERROR 404</p>

        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          {title}
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#a0a0a0] md:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="btn-neon-primary">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          <Button asChild variant="outline" className="btn-outline-neon">
            <Link href="/">Explore restaurants</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
