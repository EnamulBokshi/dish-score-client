import AdminUserManagementTable from "@/components/admin/users/AdminUserManagementTable";
import { getUserInfo } from "@/services/auth.services";
import { getAllUsers } from "@/services/user.services";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface AdminUserManagementPageProps {
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

export default async function AdminUserManagementPage({
	searchParams,
}: AdminUserManagementPageProps) {
	const queryParamsObject = await searchParams;
	const queryString = buildQueryString(queryParamsObject);
	const userInfo = await getUserInfo();
	const currentUserId = userInfo?.id ? String(userInfo.id) : "";

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["admin-users", queryString],
		queryFn: () => getAllUsers(queryString),
		staleTime: 10 * 60 * 1000,
		gcTime: 6 * 60 * 60 * 1000,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminUserManagementTable
				queryString={queryString}
				queryParamsObject={queryParamsObject}
				currentUserId={currentUserId}
			/>
		</HydrationBoundary>
	);
}
