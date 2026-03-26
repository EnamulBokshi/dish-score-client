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
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={container}>
      <div className="flex flex-col items-center gap-4">
        {/* Neon spinner */}
        <div className={`${spinnerSize} relative`}>
          <div
            className="absolute inset-0 animate-spin rounded-full border-2 border-dark-border"
            style={{
              borderTopColor: "#FF5722",
              animationDuration: "1s",
            }}
          />
          <div
            className="absolute inset-1 animate-spin rounded-full border-2 border-dark-border"
            style={{
              borderRightColor: "#FFD700",
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />
        </div>

        {message && (
          <p className="text-sm text-[#a0a0a0] text-center">{message}</p>
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  return <Loading message={message} size="md" fullScreen />;
}
