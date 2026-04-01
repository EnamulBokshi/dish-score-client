import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type CardTone = "rose" | "orange" | "gold" | "mint";
type CardMode = "light" | "dark";

interface MenuDishCardProps {
  id: string;
  name: string;
  restaurantName: string;
  tags?: string[];
  ingredients?: string[];
  imageUrl?: string | null;
  price?: number;
  rating?: number;
  reviews?: number;
  badgeText?: string;
  tone?: CardTone;
  mode?: CardMode;
  href?: string;
  priceContextLabel?: string;
  hidePriceContext?: boolean;
  className?: string;
}

function formatPrice(price?: number): string {
  if (typeof price !== "number") {
    return "N/A";
  }

  return `$${price.toFixed(2)}`;
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

export default function MenuDishCard({
  id,
  name,
  restaurantName,
  tags,
  ingredients,
  imageUrl,
  price,
  rating,
  reviews,
  badgeText,
  href,
  priceContextLabel,
  hidePriceContext = false,
  className,
}: MenuDishCardProps) {
  const destination = href || `/dishes/${id}`;

  return (
    <Link
      href={destination}
      className={cn("group block overflow-hidden", className)}
      style={{
        fontFamily: "'Tahoma','Verdana','Arial',sans-serif",
        fontSize: "11px",
      }}
    >
      <div
        className="win-raised overflow-hidden transition-all duration-150 group-hover:brightness-95"
      >
        {/* Mini titlebar */}
        <div
          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-white select-none"
          style={{ background: "linear-gradient(to right, #0a246a, #4872c4)" }}
        >
          {badgeText && (
            <span
              className="mr-1 inline-block px-1 py-0 text-[9px] font-bold text-white"
              style={{ background: "#cc0000", border: "1px solid #800000" }}
            >
              {badgeText}
            </span>
          )}
          <span className="truncate">{name}</span>
        </div>

        <div className="flex gap-2 p-2">
          {/* Image thumbnail */}
          <div
            className="h-16 w-16 shrink-0 overflow-hidden"
            style={{
              border: "2px solid",
              borderColor: "#404040 #ffffff #ffffff #404040",
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-[18px] font-bold text-[#0a246a]"
                style={{ background: "#ece9d8" }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-[11px] font-bold text-[#000000]">{name}</h3>
            <p className="line-clamp-1 text-[10px] text-[#0000cc] underline">{restaurantName}</p>

            {tags?.length ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1 text-[9px] text-[#444444]"
                    style={{ background: "#ece9d8", border: "1px solid #808080" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {ingredients?.length ? (
              <p className="mt-0.5 text-[10px] text-[#444444]">
                {ingredients.slice(0, 2).join(", ")}
              </p>
            ) : null}

            <div className="mt-1 flex items-center gap-2 text-[10px]">
              <span className="font-bold text-[#cc0000] flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-[#cc8800] text-[#cc8800]" />
                {formatRating(rating)}
              </span>
              <span className="text-[#666666]">{reviews ?? 0} reviews</span>
            </div>
          </div>
        </div>

        {/* Footer row */}
        {!hidePriceContext && (
          <div
            className="flex items-center justify-between px-2 py-0.5 text-[10px] text-[#444444]"
            style={{ borderTop: "1px solid #808080", background: "#ece9d8" }}
          >
            <span>{priceContextLabel || `Price: ${formatPrice(price)}`}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
