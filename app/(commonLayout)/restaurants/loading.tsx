import { PageSkeleton } from "@/components/common";

export default function RestaurantsLoading() {
  return <PageSkeleton type="list" cardCount={6} />;
}
