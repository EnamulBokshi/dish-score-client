import { Skeleton } from "@/components/ui/skeleton";

type DashboardSkeletonVariant = "consumer" | "owner" | "admin";

interface DashboardStatsSkeletonProps {
  variant: DashboardSkeletonVariant;
}

const variantConfig: Record<DashboardSkeletonVariant, { cardCount: number; chartCount: number }> = {
  consumer: { cardCount: 4, chartCount: 1 },
  owner: { cardCount: 2, chartCount: 1 },
  admin: { cardCount: 6, chartCount: 4 },
};

export default function DashboardStatsSkeleton({ variant }: DashboardStatsSkeletonProps) {
  const { cardCount, chartCount } = variantConfig[variant];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div key={`stat-card-${index}`} className="rounded-lg border border-border bg-card/80 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: chartCount }).map((_, index) => (
          <div key={`chart-${index}`} className="rounded-lg border border-border bg-card/80 p-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="mt-2 h-4 w-64" />
            <Skeleton className="mt-5 h-75 w-full rounded-md" />
          </div>
        ))}
      </div>

      {variant === "consumer" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`quick-link-${index}`} className="rounded-lg border border-border bg-card/80 p-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="mt-3 h-4 w-16" />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
