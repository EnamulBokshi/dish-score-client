import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { IRestaurant } from "@/types/restaurant.types";

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

export const restaurantColumns: ColumnDef<IRestaurant>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    id: "ratingAvg",
    accessorKey: "ratingAvg",
    header: "Rating",
    cell: ({ row }) => <Badge variant="secondary">{Number(row.original.ratingAvg || 0).toFixed(1)}/5</Badge>,
  },
  {
    accessorKey: "totalReviews",
    header: "Reviews",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="block max-w-[20rem] truncate text-sm text-muted-foreground">{row.original.address}</span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateLabel(row.original.createdAt),
  },
];
