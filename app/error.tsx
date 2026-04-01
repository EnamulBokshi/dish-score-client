"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/common/ErrorState";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4"> 
<ErrorState
      title="Connection failed"
      description="Unable to reach the server. Please check your internet connection and try again."
      error={error}
      retry={reset}
      variant="card"
    />
    </div>
  );
}
