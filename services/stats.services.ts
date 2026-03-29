"use server";

import { httpClient } from "@/lib/httpClient";

export interface IPublicStats {
  totalReviews: number;
  totalReviewer: number;
  totalRestaurants: number;
  totalDishes: number;
}

export async function getDashboardStats<TStats>() {
  try {
    const response = await httpClient.get<TStats>("/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}

export async function getPublicStats(): Promise<IPublicStats | null> {
  try {
    const response = await httpClient.get<IPublicStats>("/stats/public");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    return null;
  }
}
