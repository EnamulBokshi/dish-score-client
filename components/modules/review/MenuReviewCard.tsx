import Link from "next/link";
import { MessageSquareQuote, Star, ThumbsUp, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

interface MenuReviewCardProps {
  id: string;
  dishName: string;
  restaurantName: string;
  reviewerName: string;
  rating: number;
  likes: number;
  comment?: string | null;
  imageUrl?: string | null;
  createdAtLabel?: string;
  tone?: "rose" | "orange" | "gold" | "mint";
}

type ToneClasses = {
  ring: string;
  badge: string;
  badgeText: string;
};

const toneMap: Record<NonNullable<MenuReviewCardProps["tone"]>, ToneClasses> = {
  rose: {
    ring: "ring-[#ef4c7d]/25",
    badge: "bg-[#ffe7ee] border-[#ffcade]",
    badgeText: "text-[#c03a68]",
  },
  orange: {
    ring: "ring-[#f08f56]/25",
    badge: "bg-[#fff0e5] border-[#ffd9c1]",
    badgeText: "text-[#c56834]",
  },
  gold: {
    ring: "ring-[#d0a42a]/25",
    badge: "bg-[#fff6df] border-[#f5e0a5]",
    badgeText: "text-[#9c7815]",
  },
  mint: {
    ring: "ring-[#40bfa6]/25",
    badge: "bg-[#e8fff8] border-[#c8f6ea]",
    badgeText: "text-[#25866f]",
  },
};

function clampRating(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(5, value));
}

function truncateComment(comment?: string | null): string {
  if (!comment || !comment.trim()) {
    return "No written comment for this review.";
  }

  if (comment.length <= 125) {
    return comment;
  }

  return `${comment.slice(0, 122)}...`;
}

export default function MenuReviewCard({
  id,
  dishName,
  restaurantName,
  reviewerName,
  rating,
  likes,
  comment,
  imageUrl,
  createdAtLabel,
  tone = "rose",
}: MenuReviewCardProps) {
  const toneClasses = toneMap[tone];
  const safeRating = clampRating(rating);

  return (
    <Link
      href={`/reviews/${id}`}
      className="group block h-full rounded-[28px] border border-[#edd9cf] bg-white p-4 shadow-[0_24px_34px_-30px_rgba(100,70,58,0.4)] transition hover:-translate-y-1 hover:border-[#dcc6bc] hover:shadow-[0_28px_40px_-28px_rgba(90,66,55,0.5)]"
    >
      <article className="flex h-full flex-col gap-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "relative h-16 w-16 overflow-hidden rounded-full border border-white bg-[#f4ece7] ring-4",
              toneClasses.ring,
            )}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={dishName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#efe4dd] to-[#e7dad2] text-2xl font-bold text-[#6b5b53]">
                {dishName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-[#3b2f2b]">{dishName}</p>
            <p className="truncate text-sm text-[#7f6f68]">{restaurantName}</p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#f0e1d9] bg-[#fdf8f5] px-2 py-0.5 text-xs text-[#8a786f]">
              <UserRound className="h-3 w-3" />
              {reviewerName}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[#f1e3db] bg-[#fcf7f3] px-3 py-2.5">
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#8b5d4f]">
            <Star className="h-4 w-4 fill-[#f5bb2b] text-[#f5bb2b]" />
            {safeRating.toFixed(1)} / 5
          </p>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#6f635d]">
            <ThumbsUp className="h-3.5 w-3.5" />
            {likes} helpful
          </p>
        </div>

        <div className="flex-1 rounded-2xl border border-[#f1e3db] bg-[#fffdfb] p-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#a08d85]">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Review Note
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5d4e48]">{truncateComment(comment)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
              toneClasses.badge,
              toneClasses.badgeText,
            )}
          >
            Community Review
          </span>
          <p className="text-xs text-[#9e8b82]">{createdAtLabel || "Recently"}</p>
        </div>
      </article>
    </Link>
  );
}
