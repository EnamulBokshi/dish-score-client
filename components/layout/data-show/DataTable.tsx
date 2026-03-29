import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { ReactNode } from "react";
import DataTableSearch, { DataTableSearchProps } from "../data-table/DataTableSearch";
import DataTablePagination, { DataTablePaginationProps } from "../data-table/DataTablePagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  actions?: DataTableActions<TData>;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRowCount?: number;
  renderLoadingCell?: (args: { column: ColumnDef<TData>; columnIndex: number }) => ReactNode;
  search?: DataTableSearchProps;
  filters?: ReactNode;
  pagination?: DataTablePaginationProps;
  sorting?: {
    state: SortingState;
    onSortingChange: (state: SortingState) => void;
  };
}

interface DataTableActions<TData> {
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  labels?: {
    view?: string;
    edit?: string;
    delete?: string;
  };
}
export default function DataTable<TData>({
  data,
  columns,
  actions,
  emptyMessage,
  isLoading,
  loadingRowCount = 6,
  renderLoadingCell,
  search,
  filters,
  pagination,
  sorting,
}: DataTableProps<TData>) {
  const tableColumns: ColumnDef<TData>[] = actions
    ? [
        ...columns,
        {
          id: "actions", // Unique ID for the actions column
          header: "Actions",
          enableSorting: false,
          cell: ({ row }) => {
            const rowData = row.original;
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className={"h-8 w-8 p-0"}>
                    {/* <span className="sr-only">Open actions menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.633 10.5c.806 0 1.533-.446 1.866-1.08a3.004 3.004 0 012.631-1.08c.806 0 1.533-.446 1.866-1.08a3.004 3.004 0 012.631-1.08M3 16.5h1.5m3 0h1.5m3 0h1.5m3 0h1.5M9.633 19.5c.806 0 1.533-.446 1.866-1.08a3.004 3.004 0 012.631-1.08c.806 0 1.533-.446 1.866-1.08a3.004 3.004 0 012.631-1.08M3 10.5h1.5m3 0h1.5m3 0h1.5m3 0h1.5"
                      />
                    </svg> */}

                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {actions.onView && (
                    <DropdownMenuItem
                      onClick={() => actions.onView?.(rowData)}
                      className="cursor-pointer"
                    >
                      {actions.labels?.view || "View"}
                    </DropdownMenuItem>
                  )}
                  {actions.onEdit && (
                    <DropdownMenuItem
                      onClick={() => actions.onEdit?.(rowData)}
                      className="cursor-pointer"
                    >
                      {actions.labels?.edit || "Edit"}
                    </DropdownMenuItem>
                  )}
                  {actions.onDelete && (
                    <DropdownMenuItem
                      onClick={() => actions.onDelete?.(rowData)}
                      className="cursor-pointer"
                    >
                      {actions.labels?.delete || "Delete"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ]
    : columns;

  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: Boolean(sorting),
    manualPagination: Boolean(pagination),
    pageCount: pagination?.pageCount,
    getSortedRowModel: getSortedRowModel(),
    state: {
      ...(sorting ? { sorting: sorting.state } : {}),
      ...(pagination ? { pagination: pagination.state } : {}),
    },
    onSortingChange: sorting
      ? (updater) => {
          const currentSortingState = sorting?.state || [];
          const nextSortingState =
            typeof updater === "function"
              ? updater(currentSortingState)
              : updater;
          sorting.onSortingChange(nextSortingState);
        }
      : () => {},
    onPaginationChange: pagination
      ? (updater) => {
          const currentPaginationState = pagination.state;
          const nextPaginationState =
            typeof updater === "function"
              ? updater(currentPaginationState)
              : updater;
          pagination.onPaginationChange(nextPaginationState);
        }
      : () => {},
  });

  return (
    <div className="relative">
      {(search || filters) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          {search && (
            <div className="min-w-64 flex-1">
              <DataTableSearch {...search} />
            </div>
          )}
          {filters && <div className="shrink-0">{filters}</div>}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button 
                      variant={"ghost"} 
                      className={"h-auto cursor-pointer p-0 font-semibold hover:bg-transparent hover:text-inherit focus-visible:ring-0"}
                      onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </Button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: loadingRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {tableColumns.map((column, columnIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${column.id ?? columnIndex}`}>
                      {renderLoadingCell ? (
                        renderLoadingCell({ column, columnIndex })
                      ) : (
                        <Skeleton className="h-4 w-full" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage || "No data available."}
                </TableCell>
              </TableRow>
            ) : (
              getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && <DataTablePagination {...pagination} />}
    </div>
  );
}
