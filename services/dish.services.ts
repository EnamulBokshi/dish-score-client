"use server";

import { httpClient } from "@/lib/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IDish, ITrendingDish } from "@/types/dish.types";

export async function getTrendingDishes(): Promise<ITrendingDish[]> {
  try {
    const response = await httpClient.get<ITrendingDish[]>("/dishes/trending");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch trending dishes:", error);
    return [];
  }
}

export async function getDishes(query?: string): Promise<ApiResponse<IDish[]>> {
  try {
    const params = query ? Object.fromEntries(new URLSearchParams(query).entries()) : undefined;
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
