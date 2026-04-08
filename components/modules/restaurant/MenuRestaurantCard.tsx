import Link from "next/link";
import { MapPin, Star, Utensils } from "lucide-react";

import { cn } from "@/lib/utils";

type CardTone = "rose" | "orange" | "gold" | "mint";

interface MenuRestaurantCardProps {
  id: string;
  name: string;
  locationLabel: string;
  tags?: string[];
  imageUrl?: string | null;
  rating?: number;
  reviews?: number;
  badgeText?: string;
  tone?: CardTone;
  href?: string;
  contextLabel?: string;
  mode?: "light" | "dark" | "auto";
  className?: string;
}

function formatRating(rating?: number): string {
  if (typeof rating !== "number") {
    return "N/A";
  }

  return rating.toFixed(1);
}

const toneMap: Record<
  CardTone,
  {
    ring: string;
    chip: string;
    chipText: string;
    accentBg: string;
  }
> = {
  rose: {
    ring: "border-[#d7a1ad]",
    chip: "bg-[#fef5f7] border-[#e8ccd2]",
    chipText: "text-[#8f5968]",
    accentBg: "from-[#f6ebee] to-[#fffaf9]",
  },
  orange: {
    ring: "border-[#d6b08e]",
    chip: "bg-[#fcf6f0] border-[#ebdbc9]",
    chipText: "text-[#89684a]",
    accentBg: "from-[#f5efe8] to-[#fffaf7]",
  },
  gold: {
    ring: "border-[#cabd8f]",
    chip: "bg-[#fbf9f1] border-[#e8e2ca]",
    chipText: "text-[#7a7050]",
    accentBg: "from-[#f6f3e8] to-[#fffdf6]",
  },
  mint: {
    ring: "border-[#9dbdb1]",
    chip: "bg-[#f1f8f5] border-[#cfdfd8]",
    chipText: "text-[#4f7568]",
    accentBg: "from-[#eaf3ef] to-[#f9fdfb]",
  },
};

export default function MenuRestaurantCard({
  id,
  name,
  locationLabel,
  tags,
  imageUrl,
  rating,
  reviews,
  badgeText,
  tone = "rose",
  href,
  contextLabel,
  mode = "auto",
  className,
}: MenuRestaurantCardProps) {
  const colors = toneMap[tone];
  const destination = href || `/restaurants/${id}`;
  const isDark = mode === "dark";
  const isAuto = mode === "auto";

  return (
    <Link
      href={destination}
      className={cn(
        "group block rounded-[28px] p-3 pt-4 transition duration-300 hover:-translate-y-1",
        isDark &&
          "border border-white/12 bg-[#0d0d14]/70 shadow-[0_22px_34px_-20px_rgba(0,0,0,0.6)] hover:shadow-[0_26px_38px_-20px_rgba(0,0,0,0.72)]",
        mode === "light" &&
          "border border-[#e9dfda] bg-white shadow-[0_14px_24px_-18px_rgba(65,46,39,0.28)] hover:shadow-[0_22px_34px_-20px_rgba(65,46,39,0.35)]",
        isAuto &&
          "border border-[#e9dfda] bg-white shadow-[0_14px_24px_-18px_rgba(65,46,39,0.28)] hover:shadow-[0_22px_34px_-20px_rgba(65,46,39,0.35)] dark:border-white/12 dark:bg-[#0d0d14]/70 dark:shadow-[0_22px_34px_-20px_rgba(0,0,0,0.6)] dark:hover:shadow-[0_26px_38px_-20px_rgba(0,0,0,0.72)]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto mb-3 flex w-fit -translate-y-1 items-center justify-center rounded-full p-1",
          isDark && "bg-black/35",
          mode === "light" && "bg-[#f8f4f2]",
          isAuto && "bg-[#f8f4f2] dark:bg-black/35",
        )}
      >
        <div
          className={cn(
            "h-24 w-24 overflow-hidden rounded-full border-[3px] sm:h-26 sm:w-26",
            isDark && "bg-[#11131b]",
            mode === "light" && "bg-[#f7f5f4]",
            isAuto && "bg-[#f7f5f4] dark:bg-[#11131b]",
            colors.ring,
          )}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-linear-to-br text-3xl font-bold",
                isDark && "text-[#d5cac4]",
                mode === "light" && "text-[#5c4d47]",
                isAuto && "text-[#5c4d47] dark:text-[#d5cac4]",
                colors.accentBg,
              )}
            >
              <Utensils className="h-8 w-8" />
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "space-y-2 rounded-2xl px-3 py-3",
          isDark && "bg-[#171922]",
          mode === "light" && "bg-[#faf8f7]",
          isAuto && "bg-[#faf8f7] dark:bg-[#171922]",
        )}
      >
        {badgeText ? (
          <p
            className={cn(
              "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
              colors.chip,
              colors.chipText,
            )}
          >
            {badgeText}
          </p>
        ) : null}

        <h3
          className={cn(
            "line-clamp-2 text-xl leading-tight font-bold",
            isDark && "text-[#f2ece8]",
            mode === "light" && "text-[#2a2220]",
            isAuto && "text-[#2a2220] dark:text-[#f2ece8]",
          )}
        >
          {name}
        </h3>

        <p
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium",
            isDark && "text-[#b8ada8]",
            mode === "light" && "text-[#7e716a]",
            isAuto && "text-[#7e716a] dark:text-[#b8ada8]",
          )}
        >
          <MapPin className="h-3.5 w-3.5" />
          {locationLabel}
        </p>

        {tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  isDark && "border-white/20 bg-white/5 text-[#cdc0ba]",
                  mode === "light" && "border-[#e6d9d2] bg-[#fffdfa] text-[#816f66]",
                  isAuto &&
                    "border-[#e6d9d2] bg-[#fffdfa] text-[#816f66] dark:border-white/20 dark:bg-white/5 dark:text-[#cdc0ba]",
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <p
            className={cn(
              "inline-flex items-center gap-1 text-base font-semibold",
              isDark && "text-[#e7ddd8]",
              mode === "light" && "text-[#5f514b]",
              isAuto && "text-[#5f514b] dark:text-[#e7ddd8]",
            )}
          >
            <Star className="h-3.5 w-3.5 fill-[#f5bb2b] text-[#f5bb2b]" />
            {formatRating(rating)}
          </p>
          <p
            className={cn(
              "text-sm font-semibold",
              isDark && "text-[#c3b8b2]",
              mode === "light" && "text-[#6f635d]",
              isAuto && "text-[#6f635d] dark:text-[#c3b8b2]",
            )}
          >
            {reviews ?? 0} reviews
          </p>
        </div>

        <p
          className={cn(
            "text-xs",
            isDark && "text-[#9f918b]",
            mode === "light" && "text-[#93857d]",
            isAuto && "text-[#93857d] dark:text-[#9f918b]",
          )}
        >
          {contextLabel || "Tap to view full review profile"}
        </p>
      </div>
    </Link>
  );
}
