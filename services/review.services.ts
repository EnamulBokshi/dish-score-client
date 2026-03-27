"use server";

import { httpClient } from "@/lib/httpClient";
import { IRecentReview } from "@/types/review.types";

export async function getRecentReviews(): Promise<IRecentReview[]> {
	try {
		const response = await httpClient.get<IRecentReview[]>("/reviews");
		return Array.isArray(response.data) ? response.data : [];
	} catch (error) {
		console.error("Failed to fetch recent reviews:", error);
		return [];
	}
}
