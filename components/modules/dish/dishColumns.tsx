import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDish } from "@/types/dish.types";

function getInitials(name?: string): string {
  if (!name) {
    return "D";
  }

  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "D"
  );
}

function formatDateLabel(value: string | undefined): string {
  if (!value) return "-";
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

function formatPrice(price: number | undefined): string {
  if (!price) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export const dishColumns: ColumnDef<IDish>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const dish = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar size="default" className="size-9">
            <AvatarImage src={dish.image ?? ""} alt={dish.name} />
            <AvatarFallback>{getInitials(dish.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{dish.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-semibold">{formatPrice(row.original.price)}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="block max-w-[20rem] truncate text-sm text-muted-foreground">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    id: "ingredients",
    header: "Ingredients",
    cell: ({ row }) => (
      <span className="block max-w-[20rem] truncate text-sm text-muted-foreground">
        {row.original.ingredients?.length
          ? row.original.ingredients.slice(0, 3).join(", ")
          : "-"}
      </span>
    ),
  },
  {
    id: "ratingAvg",
    accessorKey: "ratingAvg",
    header: "Rating",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {Number(row.original.ratingAvg || 0).toFixed(1)}/5
      </Badge>
    ),
  },
  {
    accessorKey: "totalReviews",
    header: "Reviews",
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateLabel(row.original.createdAt),
  },
];
