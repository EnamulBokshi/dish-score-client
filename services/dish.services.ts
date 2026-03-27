"use server";

import { httpClient } from "@/lib/httpClient";
import { ITrendingDish } from "@/types/dish.types";

export async function getTrendingDishes(): Promise<ITrendingDish[]> {
  try {
    const response = await httpClient.get<ITrendingDish[]>("/dishes/trending");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch trending dishes:", error);
    return [];
  }
}
