import axios from "axios";

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

  try {
    const response = await axios.post(
      `${baseUrl}/likes/toggle`,
      { reviewId },
      {
        withCredentials: true,
      }
    );

    const data = response.data?.data as Partial<IToggleLikeResponse>;

    return {
      action: data.action,
      liked: Boolean(data.liked),
      reviewId: data.reviewId || reviewId,
      totalLikes: typeof data.totalLikes === "number" ? data.totalLikes : 0,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to toggle like";
    throw new Error(message);
  }
}
