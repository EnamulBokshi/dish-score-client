"use server";

import { httpClient } from "@/lib/httpClient";
import { cookies } from "next/headers";
import { ApiResponse } from "@/types/api.types";
import {
	IRecentReview,
	IReview,
	IReviewQueryParams,
	IUpdateReviewPayload,
} from "@/types/review.types";

const BaseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BaseApiUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined!");
}

function parseQueryString(queryString?: string): Record<string, unknown> | undefined {
	if (!queryString) {
		return undefined;
	}

	const params = new URLSearchParams(queryString);
	const parsed: Record<string, unknown> = {};

	params.forEach((value, key) => {
		parsed[key] = value;
	});

	return Object.keys(parsed).length > 0 ? parsed : undefined;
}

export async function getRecentReviews(): Promise<IRecentReview[]> {
	try {
		const response = await httpClient.get<IRecentReview[]>("/reviews");
		return Array.isArray(response.data) ? response.data : [];
	} catch (error) {
		console.error("Failed to fetch recent reviews:", error);
		return [];
	}
}

export async function getReviews(
	query?: IReviewQueryParams | string,
): Promise<ApiResponse<IReview[]>> {
	try {
		const params =
			typeof query === "string"
				? parseQueryString(query)
				: (query as Record<string, unknown> | undefined);

		const response = await httpClient.get<IReview[]>("/reviews", {
			params,
		});

		return {
			success: response.success,
			data: Array.isArray(response.data) ? response.data : [],
			message: response.message,
			meta: response.meta,
		};
	} catch (error) {
		console.error("Failed to fetch reviews:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch reviews",
		};
	}
}

export async function getReviewById(reviewId: string): Promise<IReview | null> {
	try {
		const response = await httpClient.get<IReview>(`/reviews/${reviewId}`);
		return response?.data ?? null;
	} catch (error) {
		console.error(`Failed to fetch review details for id ${reviewId}:`, error);
		return null;
	}
}

export async function getMyReviews(
	query?: IReviewQueryParams | string,
): Promise<ApiResponse<IReview[]>> {
	try {
		const params =
			typeof query === "string"
				? parseQueryString(query)
				: (query as Record<string, unknown> | undefined);

		const response = await httpClient.get<IReview[]>("/reviews/my", {
			params,
		});

		return {
			success: response.success,
			data: Array.isArray(response.data) ? response.data : [],
			message: response.message,
			meta: response.meta,
		};
	} catch (error) {
		console.error("Failed to fetch my reviews:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch my reviews",
		};
	}
}

export async function updateMyReview(
	reviewId: string,
	payload: IUpdateReviewPayload,
): Promise<IReview> {
	const response = await httpClient.patch<IReview>(`/reviews/my/${reviewId}`, payload);
	return response.data;
}

export async function updateReviewByAdmin(
	reviewId: string,
	payload: IUpdateReviewPayload,
): Promise<IReview> {
	const response = await httpClient.patch<IReview>(`/reviews/${reviewId}`, payload);
	return response.data;
}

export async function deleteMyReview(reviewId: string): Promise<IReview> {
	const response = await httpClient.delete<IReview>(`/reviews/my/${reviewId}`);
	return response.data;
}

export async function deleteReviewByAdmin(reviewId: string): Promise<IReview> {
	const response = await httpClient.delete<IReview>(`/reviews/${reviewId}`);
	return response.data;
}

export async function createReview(formData: FormData): Promise<IReview> {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore
		.getAll()
		.map((cookie) => `${cookie.name}=${cookie.value}`)
		.join("; ");

	const response = await fetch(`${BaseApiUrl}/reviews`, {
		method: "POST",
		headers: {
			Cookie: cookieHeader,
		},
		body: formData,
		cache: "no-store",
	});

	const result = await response.json();

	if (!response.ok || !result?.success) {
		throw new Error(result?.message || "Failed to create review");
	}

	return result.data as IReview;
}