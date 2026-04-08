"use server";

import { httpClient } from "@/lib/httpClient";
import {
	IAIChatPayload,
	IAIChatResult,
	IAIReviewDescriptionPayload,
	IAIReviewDescriptionResult,
	IAISearchSuggestionsPayload,
	IAISearchSuggestionsResult,
} from "@/types/ai.types";

export async function aiChat(payload: IAIChatPayload): Promise<IAIChatResult | null> {
	try {
		const response = await httpClient.post<IAIChatResult>("/ai/chat", payload);
		return response.data ?? null;
	} catch (error) {
		console.error("Failed to generate AI chat response:", error);
		return null;
	}
}

export async function aiGenerateReviewDescription(
	payload: IAIReviewDescriptionPayload,
): Promise<IAIReviewDescriptionResult | null> {
	try {
		const response = await httpClient.post<IAIReviewDescriptionResult>(
			"/ai/review-description",
			payload,
		);
		return response.data ?? null;
	} catch (error) {
		console.error("Failed to generate AI review description:", error);
		return null;
	}
}

export async function aiSearchSuggestions(
	payload: IAISearchSuggestionsPayload,
): Promise<IAISearchSuggestionsResult | null> {
	try {
		const response = await httpClient.post<IAISearchSuggestionsResult>(
			"/ai/search-suggestions",
			payload,
		);
		return response.data ?? null;
	} catch (error) {
		console.error("Failed to generate AI search suggestions:", error);
		return null;
	}
}
