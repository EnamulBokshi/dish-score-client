import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { ContactMessageStatus, IContactMessage } from "@/types/contact.types";

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

function getStatusVariant(status: ContactMessageStatus): "default" | "secondary" | "outline" {
  if (status === "RESOLVED") {
    return "default";
  }

  if (status === "IN_PROGRESS") {
    return "secondary";
  }

  return "outline";
}

export const contactColumns: ColumnDef<IContactMessage>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <span className="block max-w-88 truncate text-sm">{row.original.subject}</span>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <span className="block max-w-104 truncate text-sm text-muted-foreground">{row.original.message}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDateLabel(row.original.createdAt),
  },
];
