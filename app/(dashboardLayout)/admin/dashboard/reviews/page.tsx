import AdminReviewManagementTable from "@/components/admin/reviews/AdminReviewManagementTable";
import { getReviews } from "@/services/review.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface AdminReviewManagementPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

function buildQueryString(queryParamsObject: {
  [key: string]: string | string[] | undefined;
}) {
  return Object.keys(queryParamsObject)
    .map((key) => {
      const value = queryParamsObject[key];
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
      }

      if (value !== undefined) {
        return `${key}=${encodeURIComponent(value)}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("&");
}

export default async function AdminReviewManagementPage({
  searchParams,
}: AdminReviewManagementPageProps) {
  const queryParamsObject = await searchParams;
  const queryString = buildQueryString(queryParamsObject);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admin-reviews", queryString],
    queryFn: () => getReviews(queryString),
    staleTime: 10 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminReviewManagementTable
        queryString={queryString}
        queryParamsObject={queryParamsObject}
      />
    </HydrationBoundary>
  );
}
