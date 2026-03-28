export interface IToggleLikeResponse {
  action?: "LIKED" | "UNLIKED";
  liked: boolean;
  reviewId: string;
  totalLikes: number;
}

export async function toggleReviewLike(reviewId: string): Promise<IToggleLikeResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await fetch(`${baseUrl}/likes/toggle`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviewId }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    const message =
      (result && typeof result.message === "string" && result.message) ||
      "Failed to toggle like";
    throw new Error(message);
  }

  const data = (result?.data ?? {}) as Partial<IToggleLikeResponse>;

  return {
    action: data.action,
    liked: Boolean(data.liked),
    reviewId: data.reviewId || reviewId,
    totalLikes: typeof data.totalLikes === "number" ? data.totalLikes : 0,
  };
}
