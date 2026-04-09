"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

interface SwipeMediaCarouselProps {
  images: string[];
  alt: string;
  placeholderLabel: string;
}

export default function SwipeMediaCarousel({
  images,
  alt,
  placeholderLabel,
}: SwipeMediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const hasImages = images.length > 0;

  const activeImage = useMemo(() => {
    if (!hasImages) {
      return null;
    }

    const normalizedIndex = ((activeIndex % images.length) + images.length) % images.length;
    return images[normalizedIndex];
  }, [activeIndex, hasImages, images]);

  const canSlide = images.length > 1;

  function move(step: number) {
    if (!canSlide) {
      return;
    }

    setActiveIndex((prev) => {
      const next = prev + step;
      if (next < 0) {
        return images.length - 1;
      }
      if (next >= images.length) {
        return 0;
      }
      return next;
    });
  }

  function handleTouchStart(positionX: number) {
    setTouchStartX(positionX);
  }

  function handleTouchEnd(positionX: number) {
    if (!canSlide || touchStartX === null) {
      setTouchStartX(null);
      return;
    }

    const delta = positionX - touchStartX;
    const threshold = 40;

    if (delta > threshold) {
      move(-1);
    } else if (delta < -threshold) {
      move(1);
    }

    setTouchStartX(null);
  }

  return (
    <div
      className="relative h-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f14] sm:h-56"
      onTouchStart={(event) => handleTouchStart(event.changedTouches[0].clientX)}
      onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
    >
      {activeImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={activeImage} alt={alt} className="h-full w-full object-cover" draggable={false} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neon-orange/35 via-neon-pink/20 to-neon-gold/35 text-4xl font-bold text-white/90">
          {placeholderLabel}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-black/10" />

      {canSlide && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            className="absolute left-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition hover:border-neon-orange/70 hover:text-neon-orange sm:left-3 sm:h-8 sm:w-8"
            aria-label="Show previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition hover:border-neon-orange/70 hover:text-neon-orange sm:right-3 sm:h-8 sm:w-8"
            aria-label="Show next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-3">
            {images.map((_, index) => (
              <button
                key={`${alt}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={
                  index === activeIndex
                    ? "h-1.5 w-5 rounded-full bg-neon-orange"
                    : "h-1.5 w-1.5 rounded-full bg-white/55"
                }
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
