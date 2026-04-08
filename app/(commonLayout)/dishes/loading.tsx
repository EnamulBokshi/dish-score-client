import { PageSkeleton } from "@/components/common";

export default function DishesLoading() {
  return <PageSkeleton type="list" cardCount={9} />;
}
