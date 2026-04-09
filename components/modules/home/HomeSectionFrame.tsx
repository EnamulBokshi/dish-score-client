import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HomeSectionFrameProps {
  badgeLabel: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  badgeClassName?: string;
  titleGradientClassName?: string;
  cardClassName?: string;
  backgroundGradientClassName?: string;
  topGlowClassName?: string;
  leftGlowClassName?: string;
  rightGlowClassName?: string;
  link: {
    href: string;
    label: string;
  }
}

export default function HomeSectionFrame({
  badgeLabel,
  title,
  description,
  icon,
  children,
  className,
  badgeClassName,
  titleGradientClassName,
  cardClassName,
  backgroundGradientClassName,
  topGlowClassName,
  leftGlowClassName,
  rightGlowClassName,
  link: { href, label },
}: HomeSectionFrameProps) {
  return (
    <section className={cn("relative overflow-hidden px-4 pb-16 pt-18 sm:px-6 lg:px-8", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-b from-[#fffaf6] via-[#f7ede5] to-[#fffaf6] dark:from-[#07070b] dark:via-[#2a060f] dark:to-[#07070b]",
          backgroundGradientClassName,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-neon-orange/10 blur-3xl dark:bg-neon-orange/18",
          topGlowClassName,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-24 h-52 w-72 rounded-full bg-neon-pink/6 blur-3xl dark:bg-neon-pink/12",
          leftGlowClassName,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 right-0 h-52 w-72 rounded-full bg-neon-orange/7 blur-3xl dark:bg-neon-orange/10",
          rightGlowClassName,
        )}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <Card
          className={cn(
            "relative overflow-hidden rounded-2xl border border-[#decec3] bg-[#fff9f4]/96 px-4 py-8 shadow-[0_24px_50px_-34px_rgba(83,54,40,0.35)] backdrop-blur-sm sm:px-6 sm:py-10 lg:px-8 dark:border-[#2c2430] dark:bg-black/40 dark:shadow-[0_26px_70px_-40px_rgba(0,0,0,0.95)]",
            cardClassName,
          )}
        >
          <CardHeader className="mb-8 flex flex-col items-center px-0 text-center sm:mb-12">
            <p
              className={cn(
                "inline-flex items-center gap-2 rounded-full border bg-[#fff0e3] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em] dark:bg-[#1f1d24]",
                "border-[#f3bb97] text-[#99543b] dark:border-neon-orange/40 dark:text-neon-gold",
                badgeClassName,
              )}
            >
              {icon}
              {badgeLabel}
            </p>
            <h2 className="mt-4 text-center text-3xl font-bold leading-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              <span
                className={cn(
                  "bg-linear-to-r from-[#1f1612] via-[#8f4e30] to-[#b8741e] bg-clip-text text-transparent dark:from-white dark:via-[#ffd4b7] dark:to-neon-gold",
                  titleGradientClassName,
                )}
              >
                {title}
              </span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5a4a42] dark:text-[#b7b7c2] sm:mt-4 sm:text-base sm:leading-7">
              {description}
            </p>
          </CardHeader>

          <CardContent className="px-0">{children}</CardContent>
          
          <div className="mt-8 flex justify-center sm:justify-end">
            <Link
              href={href}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-[#ffd9c6] to-[#ffe6b3] px-4 py-2.5 text-sm font-semibold text-[#9b4d35] transition-all duration-300 hover:from-[#ffc8ac] hover:to-[#ffd98b] hover:text-[#7b3f2b] hover:shadow-[0_10px_24px_-18px_rgba(155,77,53,0.45)] sm:w-auto dark:from-neon-orange/20 dark:to-neon-gold/20 dark:text-neon-orange dark:hover:from-neon-orange/40 dark:hover:to-neon-gold/40 dark:hover:text-neon-gold dark:hover:shadow-[0_0_20px_rgba(255,165,0,0.3)]"
            >
              {label}
              <span className="text-lg">→</span>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}