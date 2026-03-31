import { GlobalSearchQueryParams, GlobalSearchResults } from "@/types/search.types";

export async function getGlobalSearchResults(
  params: GlobalSearchQueryParams,
): Promise<GlobalSearchResults> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const query = new URLSearchParams();
  query.set("searchTerm", params.searchTerm);

  if (params.restaurantId) {
    query.set("restaurantId", params.restaurantId);
  }

  if (params.scope) {
    query.set("scope", params.scope);
  }

  if (typeof params.page === "number") {
    query.set("page", String(params.page));
  }

  if (typeof params.limit === "number") {
    query.set("limit", String(params.limit));
  }

  if (params.sortOrder) {
    query.set("sortOrder", params.sortOrder);
  }

  const response = await fetch(`${baseUrl}/search?${query.toString()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    message?: string;
    data?: GlobalSearchResults;
  } | null;

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(result?.message || "Failed to load global search results");
  }

  return result.data;
}
