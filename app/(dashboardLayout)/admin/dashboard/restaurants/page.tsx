
import AdminRestaurantManagementTable from "@/components/admin/restaurants/AdminRestaurantManagementTable";
import { getRestaurants } from "@/services/restaurant.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface AdminRestaurantManagementPageProps {
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

export default async function AdminRestaurantManagementPage({
	searchParams,
}: AdminRestaurantManagementPageProps) {
	const queryParamsObject = await searchParams;
	const queryString = buildQueryString(queryParamsObject);

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["admin-restaurants", queryString],
		queryFn: () => getRestaurants(queryString),
		staleTime: 10 * 60 * 1000,
		gcTime: 6 * 60 * 60 * 1000,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminRestaurantManagementTable
				queryString={queryString}
				queryParamsObject={queryParamsObject}
			/>
		</HydrationBoundary>
	);
}
