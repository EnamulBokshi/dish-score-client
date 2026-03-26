import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description: string;
  error?: string | Error;
  retry?: () => void;
  variant?: "default" | "card" | "minimal";
}

/**
 * Error state component for failed requests or errors
 */
export function ErrorState({
  title,
  description,
  error,
  retry,
  variant = "default",
}: ErrorStateProps) {
  let containerClass = "flex flex-col items-center justify-center py-12 px-6";

  if (variant === "card") {
    containerClass = "bg-dark-card border border-[#FF0040]/30 rounded-lg p-6";
  } else if (variant === "minimal") {
    containerClass = "p-4";
  }

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Error icon */}
        <div className="text-5xl mb-4">
          <svg
            className="w-16 h-16 mx-auto text-[#FF0040]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4v2m-6-4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2zm0 0V7a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-[#FF0040] mb-2">{title}</h3>
        <p className="text-sm text-[#a0a0a0] mb-4 max-w-sm">{description}</p>

        {error && (
          <details className="mb-4 text-left bg-dark-border/30 rounded p-2">
            <summary className="cursor-pointer text-xs text-[#a0a0a0] hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-[#a0a0a0] overflow-auto max-h-32">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          {retry && (
            <Button onClick={retry} className="btn-neon-primary">
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
            className="border-dark-border text-foreground hover:bg-dark-border"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error?: Error }) {
  return (
    <ErrorState
      title="Something went wrong"
      description="An unexpected error occurred. Please try again or contact support."
      error={error}
      variant="card"
    />
  );
}

export function ErrorNotFound({ type = "page" }: { type?: string }) {
  return (
    <ErrorState
      title={`${type.charAt(0).toUpperCase() + type.slice(1)} not found`}
      description={`The ${type} you're looking for doesn't exist or has been removed.`}
      variant="default"
    />
  );
}

export function ErrorConnectionFailed({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection failed"
      description="Unable to reach the server. Please check your internet connection and try again."
      retry={onRetry}
      variant="card"
    />
  );
}

export function ErrorPermissionDenied() {
  return (
    <ErrorState
      title="Access denied"
      description="You don't have permission to access this resource."
      variant="card"
    />
  );
}
