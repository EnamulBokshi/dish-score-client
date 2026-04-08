import "server-only";

import { httpClient } from "@/lib/httpClient";
import { ApiResponse } from "@/types/api.types";
import { UserInfo } from "@/types/user.types";
import { ITestimonial, ITestimonialQueryParams } from "@/types/testimonial.types";

const DEFAULT_HOME_QUERY = "page=1&limit=9&sortBy=createdAt&sortOrder=desc";

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

function normalizeResponse(data: ITestimonial[] | undefined): ITestimonial[] {
	return Array.isArray(data) ? data : [];
}

export async function getTestimonials(
	query?: ITestimonialQueryParams | string,
): Promise<ApiResponse<ITestimonial[]>> {
	try {
		const params =
			typeof query === "string"
				? parseQueryString(query)
				: (query as Record<string, unknown> | undefined);

		const response = await httpClient.get<ITestimonial[]>("/testimonials", {
			params,
		});

		return {
			success: response.success,
			data: normalizeResponse(response.data),
			message: response.message,
			meta: response.meta,
		};
	} catch (error) {
		console.error("Failed to fetch testimonials:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch testimonials",
		};
	}
}

export async function getMyTestimonials(
	query?: ITestimonialQueryParams | string,
): Promise<ApiResponse<ITestimonial[]>> {
	try {
		const params =
			typeof query === "string"
				? parseQueryString(query)
				: (query as Record<string, unknown> | undefined);

		const response = await httpClient.get<ITestimonial[]>("/testimonials/my", {
			params,
		});

		return {
			success: response.success,
			data: normalizeResponse(response.data),
			message: response.message,
			meta: response.meta,
		};
	} catch (error) {
		console.error("Failed to fetch my testimonials:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch my testimonials",
		};
	}
}

export async function getTestimonialById(testimonialId: string): Promise<ITestimonial | null> {
	try {
		const response = await httpClient.get<ITestimonial>(`/testimonials/${testimonialId}`);
		return response.data ?? null;
	} catch (error) {
		console.error(`Failed to fetch testimonial details for id ${testimonialId}:`, error);
		return null;
	}
}

export async function getHomeTestimonials(userInfo?: UserInfo | null): Promise<ITestimonial[]> {
	const query = DEFAULT_HOME_QUERY;

	try {
		const response = await getTestimonials(query);
		if (response.data.length > 0) {
			return response.data;
		}
	} catch (error) {
		console.error("Failed to load public testimonials for home page:", error);
	}

	if (userInfo?.id) {
		try {
			const response = await getMyTestimonials(query);
			return response.data;
		} catch (error) {
			console.error("Failed to load user testimonials for home page:", error);
		}
	}

	return [];
}
