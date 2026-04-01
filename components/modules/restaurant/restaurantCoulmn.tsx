import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IRestaurant } from "@/types/restaurant.types";

function getInitials(name?: string): string {
  if (!name) {
    return "R";
  }

  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "R"
  );
}

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
    cell: ({ row }) => {
      const restaurant = row.original;
      const image = restaurant.images?.[0] ?? "";

      return (
        <div className="flex items-center gap-3">
          <Avatar size="default" className="size-9">
            <AvatarImage src={image} alt={restaurant.name} />
            <AvatarFallback>{getInitials(restaurant.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{restaurant.name}</span>
        </div>
      );
    },
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
