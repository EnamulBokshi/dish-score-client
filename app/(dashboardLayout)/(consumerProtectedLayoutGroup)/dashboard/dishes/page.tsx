import DishManagementTable from "@/components/modules/dish/DishManagementTable";
import { getMyDishes } from "@/services/dish.services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface DishManagementPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function DishManagementPage({
  searchParams,
}: DishManagementPageProps) {
  const queryParamsObject = await searchParams;
  const queryString = Object.keys(queryParamsObject)
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

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["my-dishes", queryString],
    queryFn: () => getMyDishes(queryString),
    staleTime: 10 * 60 * 1000,
    gcTime: 6 * 60 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DishManagementTable
        queryString={queryString}
        queryParamsObject={queryParamsObject}
      />
    </HydrationBoundary>
  );
}
