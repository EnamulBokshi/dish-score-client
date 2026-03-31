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
          "pointer-events-none absolute inset-0 bg-linear-to-b from-[#07070b] via-[#2a060f] to-[#07070b]",
          backgroundGradientClassName,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-neon-orange/18 blur-3xl",
          topGlowClassName,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 top-24 h-52 w-72 rounded-full bg-neon-pink/12 blur-3xl",
          leftGlowClassName,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 right-0 h-52 w-72 rounded-full bg-neon-orange/10 blur-3xl",
          rightGlowClassName,
        )}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <Card
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/12 bg-black/40 px-6 py-10 shadow-[0_26px_70px_-40px_rgba(0,0,0,0.95)] backdrop-blur-sm sm:px-8",
            cardClassName,
          )}
        >
          <CardHeader className="mb-12 flex items-center px-0 text-center">
            <p
              className={cn(
                "inline-flex items-center gap-2 rounded-full border bg-black/45 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]",
                "border-neon-orange/40 text-neon-gold",
                badgeClassName,
              )}
            >
              {icon}
              {badgeLabel}
            </p>
            <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              <span
                className={cn(
                  "bg-linear-to-r from-white via-[#ffd4b7] to-neon-gold bg-clip-text text-transparent",
                  titleGradientClassName,
                )}
              >
                {title}
              </span>
            </h2>
            <p className="mt-4 max-w-3xl text-sm text-[#b7b7c2] sm:text-base">{description}</p>
          </CardHeader>

          <CardContent className="px-0">{children}</CardContent>
          
          <div className="mt-8 flex justify-end">
            <Link 
              href={href} 
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-orange/20 to-neon-gold/20 px-4 py-2.5 text-sm font-semibold text-neon-orange transition-all duration-300 hover:from-neon-orange/40 hover:to-neon-gold/40 hover:text-neon-gold hover:shadow-[0_0_20px_rgba(255,165,0,0.3)]"
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