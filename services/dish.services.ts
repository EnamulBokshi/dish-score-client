"use server";

import { cookies } from "next/headers";

import { httpClient } from "@/lib/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateDishPayload,
  IDishDetails,
  IDish,
  ITrendingDish,
  IUpdateDishPayload,
} from "@/types/dish.types";

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

export async function getTrendingDishes(): Promise<ITrendingDish[]> {
  try {
    const response = await httpClient.get<ITrendingDish[]>("/dishes/trending");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch trending dishes:", error);
    return [];
  }
}

export async function getDishes(
  query?: string | Record<string, unknown>,
): Promise<ApiResponse<IDish[]>> {
  try {
    const params =
      typeof query === "string"
        ? parseQueryString(query)
        : (query as Record<string, unknown> | undefined);
    const response = await httpClient.get<IDish[]>("/dishes", {
      params,
    });

    return {
      success: response.success,
      data: Array.isArray(response.data) ? response.data : [],
      message: response.message,
      meta: response.meta,
    };
  } catch (error) {
    console.error("Failed to fetch dishes:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch dishes",
    };
  }
}

export async function getMyDishes(query?: string): Promise<ApiResponse<IDish[]>> {
  try {
    const params = parseQueryString(query);
    const response = await httpClient.get<IDish[]>("/dishes/me", {
      params,
    });

    return {
      success: response.success,
      data: Array.isArray(response.data) ? response.data : [],
      message: response.message,
      meta: response.meta,
    };
  } catch (error) {
    console.error("Failed to fetch my dishes:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch my dishes",
    };
  }
}

export async function getDishById(dishId: string): Promise<IDishDetails | null> {
  try {
    const response = await httpClient.get<IDishDetails>(`/dishes/${dishId}`);
    return response?.data ?? null;
  } catch (error) {
    console.error(`Failed to fetch dish details for id ${dishId}:`, error);
    return null;
  }
}

async function sendDishFormData(
  endpoint: string,
  method: "POST" | "PATCH",
  formData: FormData,
): Promise<IDish> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(`${BaseApiUrl}${endpoint}`, {
    method,
    headers: {
      Cookie: cookieHeader,
      Accept: "application/json",
    },
    body: formData,
    cache: "no-store",
  });

  // Avoid Response.json() hard failures when the backend returns an empty or non-JSON body.
  const rawBody = await response.text();
  let result: ApiResponse<IDish> | null = null;

  if (rawBody.trim().length > 0) {
    try {
      result = JSON.parse(rawBody) as ApiResponse<IDish>;
    } catch {
      result = null;
    }
  }

  if (!response.ok) {
    const backendMessage = result?.message;
    throw new Error(
      backendMessage ||
        `Failed to process dish request (HTTP ${response.status}). Response body was ${rawBody.trim() ? "non-standard" : "empty"}.`,
    );
  }

  if (!result?.success) {
    throw new Error(result?.message || "Dish request did not return a successful response");
  }

  if (!result.data) {
    throw new Error("Dish request succeeded but response data is missing");
  }

  return result.data as IDish;
}

function buildDishFormData(
  payload: ICreateDishPayload | IUpdateDishPayload,
  image?: File,
): FormData {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  if (image) {
    formData.append("image", image);
  }

  return formData;
}

export async function createDish(
  payload: ICreateDishPayload,
  image?: File,
): Promise<IDish> {
  const formData = buildDishFormData(payload, image);
  return sendDishFormData("/dishes", "POST", formData);
}

export async function updateMyDish(
  dishId: string,
  payload: IUpdateDishPayload,
  image?: File,
): Promise<IDish> {
  const formData = buildDishFormData(payload, image);
  return sendDishFormData(`/dishes/me/${dishId}`, "PATCH", formData);
}

export async function deleteMyDish(dishId: string): Promise<IDish> {
  const response = await httpClient.delete<IDish>(`/dishes/me/${dishId}`);
  return response.data;
}

export async function updateDishByAdmin(
  dishId: string,
  payload: IUpdateDishPayload,
  image?: File,
): Promise<IDish> {
  const formData = buildDishFormData(payload, image);
  return sendDishFormData(`/dishes/${dishId}`, "PATCH", formData);
}

export async function deleteDishByAdmin(dishId: string): Promise<IDish> {
  const response = await httpClient.delete<IDish>(`/dishes/${dishId}`);
  return response.data;
}
