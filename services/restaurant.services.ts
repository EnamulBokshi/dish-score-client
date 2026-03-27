"use server";

import { httpClient } from "@/lib/httpClient";
import { ITopRatedRestaurant } from "@/types/restaurant.types";

export async function getTopRatedRestaurants(): Promise<ITopRatedRestaurant[]> {
  try {
    const response = await httpClient.get<ITopRatedRestaurant[]>("/restaurants/top-rated");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch top-rated restaurants:", error);
    return [];
  }
}
