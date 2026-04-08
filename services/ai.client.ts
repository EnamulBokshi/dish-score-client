import axios from "axios";

import {
	IAIChatPayload,
	IAIChatResult,
	IAIReviewDescriptionPayload,
	IAIReviewDescriptionResult,
	IAISearchSuggestionsPayload,
	IAISearchSuggestionsResult,
} from "@/types/ai.types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
	throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

interface AIApiEnvelope<TData> {
	success?: boolean;
	message?: string;
	data?: TData;
}

function normalizeError(error: unknown, fallbackMessage: string): Error {
	if (axios.isAxiosError(error)) {
		const message =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			fallbackMessage;
		return new Error(String(message));
	}

	if (error instanceof Error) {
		return error;
	}

	return new Error(fallbackMessage);
}

export async function getAIChatResponse(payload: IAIChatPayload): Promise<IAIChatResult> {
	try {
		const response = await axios.post<AIApiEnvelope<IAIChatResult>>(
			`${baseUrl}/ai/chat`,
			payload,
			{ withCredentials: true },
		);

		const result = response.data;

		if (!result?.success || !result.data) {
			throw new Error(result?.message || "Failed to generate AI chat response");
		}

		return result.data;
	} catch (error) {
		throw normalizeError(error, "Failed to generate AI chat response");
	}
}

export async function getAIReviewDescription(
	payload: IAIReviewDescriptionPayload,
): Promise<IAIReviewDescriptionResult> {
	try {
		const response = await axios.post<AIApiEnvelope<IAIReviewDescriptionResult>>(
			`${baseUrl}/ai/review-description`,
			payload,
			{ withCredentials: true },
		);

		const result = response.data;

		if (!result?.success || !result.data) {
			throw new Error(result?.message || "Failed to generate AI review description");
		}

		return result.data;
	} catch (error) {
		throw normalizeError(error, "Failed to generate AI review description");
	}
}

export async function getAISearchSuggestions(
	payload: IAISearchSuggestionsPayload,
): Promise<IAISearchSuggestionsResult> {
	try {
		const response = await axios.post<AIApiEnvelope<IAISearchSuggestionsResult>>(
			`${baseUrl}/ai/search-suggestions`,
			payload,
			{ withCredentials: true },
		);

		const result = response.data;

		if (!result?.success || !result.data) {
			throw new Error(result?.message || "Failed to generate AI search suggestions");
		}

		return result.data;
	} catch (error) {
		throw normalizeError(error, "Failed to generate AI search suggestions");
	}
}