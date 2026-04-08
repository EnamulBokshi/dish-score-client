interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

/**
 * Loading spinner component with optional message
 */
export function Loading({
  message = "Loading...",
  size = "md",
  fullScreen = false,
}: LoadingProps) {
  const spinnerSize = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }[size];

  const container = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-[#f7f0eb]/80 backdrop-blur-sm dark:bg-[#09070d]/80"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={container}>
      <div className="flex flex-col items-center gap-4">
        {/* Neon spinner */}
        <div className={`${spinnerSize} relative`}>
          <div
            className="absolute inset-0 animate-spin rounded-full border-2 border-[#d7c8bf] dark:border-dark-border"
            style={{
              borderTopColor: "#FF8A4C",
              animationDuration: "1s",
            }}
          />
          <div
            className="absolute inset-1 animate-spin rounded-full border-2 border-[#e5d6cd] dark:border-dark-border"
            style={{
              borderRightColor: "#F5BB2B",
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />
        </div>

        {message && (
          <p className="text-center text-sm text-[#6a554b] dark:text-[#a0a0a0]">{message}</p>
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  return <Loading message={message} size="md" fullScreen />;
}
