import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Star, ThumbsUp, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { resolveMediaUrls } from "@/components/modules/home/card-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getReviewById } from "@/services/review.services";

interface ReviewDetailsPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(value?: string): string {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  const safeRating = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const full = Math.floor(safeRating);

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={index < full ? "h-4 w-4 fill-[#f8bf39] text-[#f8bf39]" : "h-4 w-4 text-white/30"}
    />
  ));
}

export default async function ReviewDetailsPage({ params }: ReviewDetailsPageProps) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  const images = resolveMediaUrls(review.images);

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-22 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#07070b] via-[#101928] to-[#07070b]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-2 h-56 w-132 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <Button
          asChild
          variant="outline"
          className="border-blue-300/40 bg-white/5 text-blue-200 hover:bg-blue-300/10"
        >
          <Link href="/reviews" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Reviews
          </Link>
        </Button>

        <Card className="overflow-hidden rounded-3xl border border-white/12 bg-black/45 shadow-[0_30px_75px_-42px_rgba(59,130,246,0.55)] backdrop-blur-sm">
          <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]">
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[0]}
                  alt={review.dish?.name || "Review image"}
                  className="h-full max-h-105 w-full object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center bg-linear-to-br from-blue-300/35 via-cyan-300/20 to-indigo-300/35 text-6xl font-bold text-white/90">
                  {(review.dish?.name || "R").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <Badge className="border-blue-300/35 bg-black/50 text-blue-200">Review Profile</Badge>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">
                  {review.dish?.name || "Dish Review"}
                </h1>
                <p className="text-sm leading-7 text-[#c2ccda] sm:text-base">
                  {review.comment?.trim() || "No written comment was provided for this review."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9fb0ca]">Rating</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-blue-200">
                    {Number(review.rating || 0).toFixed(1)}
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1">{renderStars(review.rating)}</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9fb0ca]">Helpful Votes</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-lg font-semibold text-blue-200">
                    <ThumbsUp className="h-4 w-4" />
                    {review.likes?.length ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9fb0ca]">Restaurant</p>
                  <p className="mt-1 text-sm font-semibold text-white/90">{review.restaurant?.name || "Unknown"}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#b5c0d1]">
                    <MapPin className="h-3.5 w-3.5" />
                    {[review.restaurant?.city, review.restaurant?.state].filter(Boolean).join(", ") || "Location unavailable"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#9fb0ca]">Reviewer</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                    <UserRound className="h-4 w-4" />
                    {review.user?.name || "Anonymous"}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#b5c0d1]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Posted {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="h-10 rounded-full bg-blue-500 px-4 text-white hover:bg-blue-400">
                  <Link href={`/dishes/${review.dishId}`} className="inline-flex items-center gap-2">
                    View Dish
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-blue-300/40 bg-white/5 px-4 text-blue-200 hover:bg-blue-300/10"
                >
                  <Link href={`/restaurants/${review.restaurantId}`} className="inline-flex items-center gap-2">
                    Open Restaurant
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {images.length > 1 ? (
          <Card className="rounded-3xl border border-white/10 bg-black/35 backdrop-blur-sm">
            <CardContent className="space-y-4 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-white">More Review Photos</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.slice(1).map((image, index) => (
                  <div key={`${image}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`Review image ${index + 2}`} className="h-52 w-full object-cover" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
