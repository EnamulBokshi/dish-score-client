"use server";

import { httpClient } from "@/lib/httpClient";

export async function getDashboardStats<TStats>() {
  try {
    const response = await httpClient.get<TStats>("/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}
