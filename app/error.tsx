"use client"

"use client";

import { ErrorConnectionFailed } from "@/components/common/ErrorState";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorConnectionFailed onRetry={reset} />;
}
