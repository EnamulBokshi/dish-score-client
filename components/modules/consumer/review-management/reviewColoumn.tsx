import { Badge } from "@/components/ui/badge";
import { IReview } from "@/types/review.types";
import { ColumnDef } from "@tanstack/react-table";

const reviewColumns :ColumnDef<IReview>[] =
     [
      {
        id: "restaurant.name",
        header: "Restaurant",
        accessorFn: (row) => row.restaurant?.name ?? "-",
        cell: ({ row }) => <span className="font-medium">{row.original.restaurant?.name ?? "-"}</span>,
      },
      {
        id: "dish.name",
        header: "Dish",
        accessorFn: (row) => row.dish?.name ?? "-",
        cell: ({ row }) => row.original.dish?.name ?? "-",
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
          const rating = row.original.rating;
          return <Badge variant="secondary">{rating}/5</Badge>;
        },
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => {
          const comment = row.original.comment?.trim();
          return (
            <span className="block max-w-[24rem] truncate text-sm text-muted-foreground">
              {comment || "No comment"}
            </span>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDateLabel(row.original.createdAt),
      },
    ]
    
  
function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}