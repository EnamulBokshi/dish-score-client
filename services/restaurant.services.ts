"use server";

import { cookies } from "next/headers";

import { httpClient } from "@/lib/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ICreateRestaurantPayload,
  IRestaurant,
  IRestaurantQueryParams,
  ITopRatedRestaurant,
  IUpdateRestaurantPayload,
} from "@/types/restaurant.types";

const BaseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BaseApiUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined!");
}

export async function getTopRatedRestaurants(): Promise<ITopRatedRestaurant[]> {
  try {
    const response = await httpClient.get<ITopRatedRestaurant[]>("/restaurants/top-rated");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch top-rated restaurants:", error);
    return [];
  }
}

export async function getRestaurants(
  query?: IRestaurantQueryParams | string,
): Promise<ApiResponse<IRestaurant[]>> {
  try {
    const params =
      typeof query === "string"
        ? Object.fromEntries(new URLSearchParams(query).entries())
        : (query as Record<string, unknown> | undefined);
    const response = await httpClient.get<IRestaurant[]>("/restaurants", {
      params,
    });

    return {
      success: response.success,
      data: Array.isArray(response.data) ? response.data : [],
      message: response.message,
      meta: response.meta,
    };
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch restaurants",
    };
  }
}

export async function getMyRestaurants(
  query?: IRestaurantQueryParams | string,
): Promise<ApiResponse<IRestaurant[]>> {
  try {
    const params =
      typeof query === "string"
        ? Object.fromEntries(new URLSearchParams(query).entries())
        : (query as Record<string, unknown> | undefined);

    const response = await httpClient.get<IRestaurant[]>("/restaurants/me", {
      params,
    });

    return {
      success: response.success,
      data: Array.isArray(response.data) ? response.data : [],
      message: response.message,
      meta: response.meta,
    };
  } catch (error) {
    console.error("Failed to fetch my restaurants:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch my restaurants",
    };
  }
}

export async function getRestaurantById(restaurantId: string): Promise<IRestaurant | null> {
  try {
    const response = await httpClient.get<IRestaurant>(`/restaurants/${restaurantId}`);
    return response?.data ?? null;
  } catch (error) {
    console.error(`Failed to fetch restaurant details for id ${restaurantId}:`, error);
    return null;
  }
}

function buildRestaurantFormData(
  payload: ICreateRestaurantPayload | IUpdateRestaurantPayload,
  images: File[] = [],
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  for (const image of images) {
    formData.append("images", image);
  }

  return formData;
}

async function sendRestaurantFormData(
  endpoint: string,
  method: "POST" | "PATCH",
  formData: FormData,
): Promise<IRestaurant> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const response = await fetch(`${BaseApiUrl}${endpoint}`, {
    method,
    headers: {
      Cookie: cookieHeader,
    },
    body: formData,
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to process restaurant request");
  }

  return result.data as IRestaurant;
}

export async function createRestaurant(
  payload: ICreateRestaurantPayload,
  images: File[] = [],
): Promise<IRestaurant> {
  const formData = buildRestaurantFormData(payload, images);
  return sendRestaurantFormData("/restaurants", "POST", formData);
}

export async function updateMyRestaurant(
  restaurantId: string,
  payload: IUpdateRestaurantPayload,
  images: File[] = [],
): Promise<IRestaurant> {
  const formData = buildRestaurantFormData(payload, images);
  return sendRestaurantFormData(`/restaurants/me/${restaurantId}`, "PATCH", formData);
}

export async function deleteMyRestaurant(restaurantId: string): Promise<IRestaurant> {
  const response = await httpClient.delete<IRestaurant>(`/restaurants/me/${restaurantId}`);
  return response.data;
}

export async function updateRestaurantByAdmin(
  restaurantId: string,
  payload: IUpdateRestaurantPayload,
  images: File[] = [],
): Promise<IRestaurant> {
  const formData = buildRestaurantFormData(payload, images);
  return sendRestaurantFormData(`/restaurants/${restaurantId}`, "PATCH", formData);
}

export async function deleteRestaurantByAdmin(restaurantId: string): Promise<IRestaurant> {
  const response = await httpClient.delete<IRestaurant>(`/restaurants/${restaurantId}`);
  return response.data;
}
