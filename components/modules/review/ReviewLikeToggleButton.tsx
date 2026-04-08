"use client";

import { MouseEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { toggleReviewLike } from "@/services/like.client";

interface ReviewLikeToggleButtonProps {
  reviewId: string;
  initialLikeCount: number;
  initiallyLiked: boolean;
  isLoggedIn: boolean;
  className?: string;
  preventLinkNavigation?: boolean;
  showLikedHint?: boolean;
}

export default function ReviewLikeToggleButton({
  reviewId,
  initialLikeCount,
  initiallyLiked,
  isLoggedIn,
  className,
  preventLinkNavigation = false,
  showLikedHint = false,
}: ReviewLikeToggleButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [liked, setLiked] = useState(initiallyLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setLiked(initiallyLiked);
  }, [initiallyLiked]);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  const redirectTo = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const likeMutation = useMutation({
    mutationFn: () => toggleReviewLike(reviewId),
    onMutate: () => {
      const previousLiked = liked;
      const previousCount = likeCount;

      const nextLiked = !previousLiked;
      const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));

      setLiked(nextLiked);
      setLikeCount(nextCount);

      return {
        previousLiked,
        previousCount,
      };
    },
    onSuccess: (result) => {
      setLiked(result.liked);
      setLikeCount(result.totalLikes);
    },
    onError: (error, _variables, context) => {
      if (context) {
        setLiked(context.previousLiked);
        setLikeCount(context.previousCount);
      }

      const message = error instanceof Error ? error.message : "Failed to toggle like";
      toast.error(message);
    },
  });

  const handleLikeToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (preventLinkNavigation) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!isLoggedIn) {
      toast.error("Please login to like this review");
      router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      return;
    }

    if (likeMutation.isPending) {
      return;
    }

    likeMutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleLikeToggle}
      disabled={likeMutation.isPending}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition",
        liked
          ? "border-[#f4b7c7] bg-[#ffe9f0] text-[#b64666] dark:border-[#8f3b56] dark:bg-[#36212a] dark:text-[#ffb6cd]"
          : "border-[#e6d8d1] bg-[#fdf8f5] text-[#6f635d] hover:border-[#d8c8c0] dark:border-white/12 dark:bg-[#1e2430] dark:text-[#c9bcb6] dark:hover:border-white/20",
        likeMutation.isPending ? "cursor-not-allowed opacity-75" : "cursor-pointer",
        className,
      )}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this review" : "Like this review"}
    >
      <ThumbsUp className={cn("h-3.5 w-3.5", liked ? "fill-current" : "")} />
      {likeCount} {likeCount === 1 ? "vote" : "votes"}
      {showLikedHint && liked ? (
        <span className="rounded-full border border-current/35 bg-current/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">
          You liked this
        </span>
      ) : null}
    </button>
  );
}
