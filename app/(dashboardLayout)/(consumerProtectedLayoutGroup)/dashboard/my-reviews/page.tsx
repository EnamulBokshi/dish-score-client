import MyReviewTable from '../../../../../components/modules/consumer/review-management/MyReviewTable';
import { getUserInfo } from '@/services/auth.services';
import { getMyReviews } from '@/services/review.services';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface MyReviewManagementProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export default async function MyReviewManagement({
    searchParams
}: MyReviewManagementProps) {
    const queryParamsObject = await searchParams;
        const queryString = Object.keys(queryParamsObject)
            .map((key) => {
        const value = queryParamsObject[key];
        if (Array.isArray(value)) {
            return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
        } else if (value !== undefined) {
            return `${key}=${encodeURIComponent(value)}`;
        }
        return "";
        })
            .filter(Boolean)
            .join("&");

    const userInfo = await getUserInfo();
        if (!userInfo?.id) {
            return null;
        }

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
                queryKey: ['my-reviews', queryString],
                queryFn:  () => getMyReviews(queryString),
                staleTime: 10 * 60 * 1000,
        gcTime:  6 * 60 * 60 * 1000
    })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
            <MyReviewTable
                queryString={queryString}
                queryParamsObject={queryParamsObject}
            />
    </HydrationBoundary>
  )
}
