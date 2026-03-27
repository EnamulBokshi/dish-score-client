"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import { ReactNode, useState } from "react";

interface DataTableFilterPopoverProps {
  children: ReactNode;
  onApply: () => void;
  onClear: () => void;
  activeCount?: number;
  triggerLabel?: string;
  title?: string;
  description?: string;
}

export default function DataTableFilterPopover({
  children,
  onApply,
  onClear,
  activeCount = 0,
  triggerLabel = "Filters",
  title = "Filter options",
  description = "Apply filters to refine table data.",
}: DataTableFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5">
          <SlidersHorizontal className="h-4 w-4" />
          {triggerLabel}
          {activeCount > 0 && (
            <Badge variant="secondary" className="h-5 min-w-5 rounded-md px-1 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[min(96vw,42rem)] p-3">
        <PopoverHeader>
          <PopoverTitle>{title}</PopoverTitle>
          <PopoverDescription>{description}</PopoverDescription>
        </PopoverHeader>

        <div className="mt-1">{children}</div>

        <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onClear();
              setOpen(false);
            }}
          >
            Clear Filter
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onApply();
              setOpen(false);
            }}
          >
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
