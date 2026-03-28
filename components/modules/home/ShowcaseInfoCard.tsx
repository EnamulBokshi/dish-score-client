import type { ReactNode } from "react";
import Link from "next/link";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

import SwipeMediaCarousel from "./SwipeMediaCarousel";

interface ShowcaseInfoCardProps {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  ratingText: string;
  metaText: string;
  badgeText?: string;
  leadingMeta?: ReactNode;
  href?: string;
  accentClassName?: string;
  surfaceClassName?: string;
  badgeClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  ratingClassName?: string;
  metaClassName?: string;
  leadingMetaClassName?: string;
}

export default function ShowcaseInfoCard({
  title,
  subtitle,
  description,
  images,
  ratingText,
  metaText,
  badgeText,
  leadingMeta,
  href,
  accentClassName,
  surfaceClassName,
  badgeClassName,
  subtitleClassName,
  descriptionClassName,
  ratingClassName,
  metaClassName,
  leadingMetaClassName,
}: ShowcaseInfoCardProps) {
  const cardBody = (
    <article className="group relative overflow-hidden rounded-3xl p-px">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-3xl bg-linear-to-br from-neon-orange/75 via-neon-pink/35 to-neon-gold/75 opacity-70 transition-opacity duration-300 group-hover:opacity-100",
          accentClassName,
        )}
      />

      <div
        className={cn(
          "relative rounded-[calc(var(--radius-3xl)-1px)] border border-white/10 bg-[#050509]/85 p-4 backdrop-blur-sm sm:p-5",
          surfaceClassName,
        )}
      >
        <div className="mb-4">
          <SwipeMediaCarousel
            images={images}
            alt={title}
            placeholderLabel={title.charAt(0).toUpperCase() || "D"}
          />
        </div>

        {badgeText ? (
          <p
            className={cn(
              "mb-2 inline-flex rounded-full border border-neon-gold/30 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-neon-gold",
              badgeClassName,
            )}
          >
            {badgeText}
          </p>
        ) : null}

        <h3 className="line-clamp-1 text-2xl font-bold leading-tight text-white">{title}</h3>
        <p className={cn("mt-1 line-clamp-1 text-sm font-medium text-[#f3b88d]", subtitleClassName)}>
          {subtitle}
        </p>
        <p className={cn("mt-3 line-clamp-3 text-sm leading-6 text-[#a9a9b6]", descriptionClassName)}>
          {description}
        </p>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-sm text-white/90">
              <Star className="h-4 w-4 fill-neon-gold text-neon-gold" />
              <span className={cn("font-semibold text-neon-orange", ratingClassName)}>{ratingText}</span>
            </div>
            <p className={cn("text-xs text-[#9a9aaa]", metaClassName)}>{metaText}</p>
          </div>
          {leadingMeta ? (
            <div className={cn("mt-2 text-xs text-[#c5c5d2]", leadingMetaClassName)}>{leadingMeta}</div>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-3xl transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-orange/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c]"
      >
        {cardBody}
      </Link>
    );
  }

  return cardBody;
}
