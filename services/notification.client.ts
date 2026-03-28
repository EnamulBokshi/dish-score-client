import { UserRole } from "@/types/enums";

export interface INotificationReview {
  id: string;
  createdAt?: string;
  dish?: { name?: string };
  restaurant?: { name?: string };
  likes?: Array<{ id?: string; userId?: string }>;
}

export interface INotificationRestaurant {
  id: string;
  createdAt?: string;
  name?: string;
}

interface ApiResult<TData> {
  success?: boolean;
  data?: TData;
}

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  return baseUrl;
}

async function safeFetch<TData>(endpoint: string): Promise<TData[]> {
  try {
    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as ApiResult<TData[]>;
    return Array.isArray(result?.data) ? result.data : [];
  } catch {
    return [];
  }
}

export async function fetchLatestReviews(): Promise<INotificationReview[]> {
  return safeFetch<INotificationReview>("/reviews?limit=20&sortBy=createdAt&sortOrder=desc");
}

export async function fetchLatestRestaurants(): Promise<INotificationRestaurant[]> {
  return safeFetch<INotificationRestaurant>("/restaurants?limit=20&sortBy=createdAt&sortOrder=desc");
}

export async function fetchMyReviewsForNotifications(
  role?: UserRole,
): Promise<INotificationReview[]> {
  if (!role) {
    return [];
  }

  // My reviews endpoint is most relevant for consumers; others can still receive global notifications.
  if (role !== UserRole.CONSUMER) {
    return [];
  }

  return safeFetch<INotificationReview>("/reviews/my?limit=50&sortBy=createdAt&sortOrder=desc");
}
