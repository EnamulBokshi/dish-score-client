import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "minimal";
}

/**
 * Empty state component for when no data is available
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const containerClass =
    variant === "minimal"
      ? "p-6"
      : "flex flex-col items-center justify-center py-12 px-6";

  const iconDefault = (
    <div className="text-5xl mb-4">
      <svg
        className="w-16 h-16 mx-auto text-[#2a2a3a]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
  );

  return (
    <div className={containerClass}>
      <div className="text-center">
        {icon || iconDefault}

        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

        {description && (
          <p className="text-sm text-[#a0a0a0] mb-6 max-w-sm">{description}</p>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            className="btn-neon-primary"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

export function EmptyRestaurants({
  onCreateNew,
}: {
  onCreateNew?: () => void;
}) {
  return (
    <EmptyState
      title="No restaurants yet"
      description="Start exploring or create a new restaurant to get reviews!"
      action={
        onCreateNew
          ? {
              label: "Add Restaurant",
              onClick: onCreateNew,
            }
          : undefined
      }
      icon={
        <svg
          className="w-16 h-16 mx-auto text-[#2a2a3a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0"
          />
        </svg>
      }
    />
  );
}

export function EmptyDishes() {
  return (
    <EmptyState
      title="No dishes available"
      description="This restaurant doesn't have any dishes yet. Check back soon!"
      icon={
        <svg
          className="w-16 h-16 mx-auto text-[#2a2a3a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}

export function EmptyReviews({ onWriteReview }: { onWriteReview?: () => void }) {
  return (
    <EmptyState
      title="No reviews yet"
      description="Be the first to share your experience!"
      action={
        onWriteReview
          ? {
              label: "Write Review",
              onClick: onWriteReview,
            }
          : undefined
      }
      icon={
        <svg
          className="w-16 h-16 mx-auto text-[#2a2a3a]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 8h10M7 12h4m1 8l-4-2-4 2V5a2 2 0 012-2h8a2 2 0 012 2v10l-4 2z"
          />
        </svg>
      }
    />
  );
}
