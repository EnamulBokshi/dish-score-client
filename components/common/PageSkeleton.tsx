interface PageSkeletonProps {
  type: "list" | "detail";
  accentColor?: "emerald" | "blue" | "purple";
  cardCount?: number;
}

function getAccentGradient(color: string): string {
  const gradients: Record<string, string> = {
    emerald: "bg-emerald-400/20",
    blue: "bg-blue-400/20",
    purple: "bg-purple-400/20",
  };
  return gradients[color] || "bg-emerald-400/20";
}

function ListPageSkeleton({ cardCount = 6 }: { cardCount: number }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#07070b] via-[#172009] to-[#07070b]"
      />

      <div className="relative mx-auto w-full max-w-7xl space-y-6">
        <div className="h-72 animate-pulse rounded-[40px] border border-white/10 bg-white/5" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cardCount }).map((_, index) => (
            <div key={index} className="h-76 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
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
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#07070b] via-[#172009] to-[#07070b]"
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute right-1/3 top-2 h-56 w-132 -translate-x-1/2 rounded-full ${getAccentGradient(accentColor)} blur-3xl`}
      />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <div className="h-9 w-44 animate-pulse rounded-full bg-white/10" />

        <div className="grid animate-pulse gap-6 rounded-3xl border border-white/10 bg-black/35 p-5 sm:p-7 lg:grid-cols-[1.1fr_1fr]">
          <div className="h-80 rounded-2xl bg-white/10" />
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-white/10" />
            <div className="h-10 w-3/4 rounded bg-white/10" />
            <div className="h-20 w-full rounded bg-white/10" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
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
