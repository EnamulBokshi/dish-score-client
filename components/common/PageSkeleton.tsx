interface PageSkeletonProps {
  type: "list" | "detail";
  accentColor?: "emerald" | "blue" | "purple";
  cardCount?: number;
}

function getAccentGradient(color: string): string {
  const gradients: Record<string, string> = {
    emerald: "bg-emerald-400/20 dark:bg-emerald-400/15",
    blue: "bg-blue-400/20 dark:bg-blue-400/15",
    purple: "bg-purple-400/20 dark:bg-purple-400/15",
  };
  return gradients[color] || "bg-emerald-400/20 dark:bg-emerald-400/15";
}

function ListPageSkeleton({ cardCount = 6 }: { cardCount: number }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#f6f0ea] via-[#efe1d7] to-[#f8f4ef] dark:from-[#07070b] dark:via-[#172009] dark:to-[#07070b]"
      />

      <div className="relative mx-auto w-full max-w-7xl space-y-6">
        <div className="h-72 animate-pulse rounded-[40px] border border-[#e0cec3] bg-white/80 shadow-[0_24px_50px_-36px_rgba(83,54,40,0.18)] dark:border-white/10 dark:bg-white/5 dark:shadow-none" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cardCount }).map((_, index) => (
            <div
              key={index}
              className="h-76 animate-pulse rounded-[28px] border border-[#e0cec3] bg-white/80 shadow-[0_18px_32px_-26px_rgba(83,54,40,0.14)] dark:border-white/10 dark:bg-white/5 dark:shadow-none"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailPageSkeleton({ accentColor = "emerald" }: { accentColor: string }) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-22 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#f6f0ea] via-[#efe1d7] to-[#f8f4ef] dark:from-[#07070b] dark:via-[#172009] dark:to-[#07070b]"
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute right-1/3 top-2 h-56 w-132 -translate-x-1/2 rounded-full ${getAccentGradient(accentColor)} blur-3xl`}
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <div className="h-9 w-44 animate-pulse rounded-full bg-white/80 shadow-[0_12px_24px_-18px_rgba(83,54,40,0.16)] dark:bg-white/10 dark:shadow-none" />

        <div className="grid animate-pulse gap-6 rounded-3xl border border-[#e0cec3] bg-white/82 p-5 shadow-[0_24px_50px_-36px_rgba(83,54,40,0.18)] backdrop-blur-sm sm:p-7 lg:grid-cols-[1.1fr_1fr] dark:border-white/10 dark:bg-black/35 dark:shadow-none">
          <div className="h-80 rounded-2xl bg-white/80 dark:bg-white/10" />
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-white/80 dark:bg-white/10" />
            <div className="h-10 w-3/4 rounded bg-white/80 dark:bg-white/10" />
            <div className="h-20 w-full rounded bg-white/80 dark:bg-white/10" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded bg-white/80 dark:bg-white/10" />
              <div className="h-16 rounded bg-white/80 dark:bg-white/10" />
              <div className="h-16 rounded bg-white/80 dark:bg-white/10" />
              <div className="h-16 rounded bg-white/80 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PageSkeleton({
  type,
  accentColor = "emerald",
  cardCount = 6,
}: PageSkeletonProps) {
  if (type === "detail") {
    return <DetailPageSkeleton accentColor={accentColor} />;
  }

  return <ListPageSkeleton cardCount={cardCount} />;
}
