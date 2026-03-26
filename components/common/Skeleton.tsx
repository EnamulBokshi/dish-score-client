import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  count?: number;
  variant?: "card" | "list" | "grid";
}

/**
 * Skeleton loader for cards - shows while data is loading
 */
export function SkeletonCard({ count = 1, variant = "card" }: SkeletonCardProps) {
  const items = Array.from({ length: count });

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-dark-card border border-dark-border rounded-lg p-4 space-y-3"
          >
            <Skeleton className="h-48 w-full rounded-md bg-dark-border" />
            <Skeleton className="h-4 w-3/4 bg-dark-border" />
            <Skeleton className="h-4 w-1/2 bg-dark-border" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 bg-dark-border" />
              <Skeleton className="h-8 w-24 bg-dark-border" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-dark-card border border-dark-border rounded-lg p-4 flex items-center gap-4"
          >
            <Skeleton className="h-16 w-16 rounded-full bg-dark-border" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2 bg-dark-border" />
              <Skeleton className="h-3 w-3/4 bg-dark-border" />
            </div>
            <Skeleton className="h-8 w-20 bg-dark-border" />
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-dark-card border border-dark-border rounded-lg p-4 space-y-3"
        >
          <Skeleton className="h-6 w-3/4 bg-dark-border" />
          <Skeleton className="h-4 w-full bg-dark-border" />
          <Skeleton className="h-4 w-5/6 bg-dark-border" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 bg-dark-border ${i === lines - 1 ? "w-1/2" : "w-full"}`}
        />
      ))}
    </div>
  );
}
