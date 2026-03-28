"use server";

import { httpClient } from "@/lib/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IUpdateUserPayload, IUser, IUserQueryParams } from "@/types/user.types";

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

export async function getAllUsers(
	query?: IUserQueryParams | string,
): Promise<ApiResponse<IUser[]>> {
	try {
		const params =
			typeof query === "string"
				? parseQueryString(query)
				: (query as Record<string, unknown> | undefined);

		const response = await httpClient.get<IUser[]>("/users", {
			params,
		});

		return {
			success: response.success,
			data: Array.isArray(response.data) ? response.data : [],
			message: response.message,
			meta: response.meta,
		};
	} catch (error) {
		console.error("Failed to fetch users:", error);
		return {
			success: false,
			data: [],
			message: "Failed to fetch users",
		};
	}
}

export async function updateUser(
	userId: string,
	payload: IUpdateUserPayload,
): Promise<IUser> {
	const response = await httpClient.patch<IUser>(`/users/${encodeURIComponent(userId)}`, payload);
	return response.data;
}

export async function deleteUser(userId: string): Promise<IUser> {
	const response = await httpClient.delete<IUser>(`/users/${encodeURIComponent(userId)}`);
	return response.data;
}
