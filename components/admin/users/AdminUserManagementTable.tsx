"use client";

import { ErrorState } from "@/components/common/ErrorState";
import DataTableFilterPopover from "@/components/layout/data-table/DataTableFilterPopOver";
import useUrlDataTableControls from "@/components/layout/data-table/UseUrlDataTableControls";
import DataTable from "@/components/layout/data-show/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteUser, getAllUsers, updateUser } from "@/services/user.services";
import { UserRole, UserStatus } from "@/types/enums";
import { IUpdateUserPayload, IUser } from "@/types/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface AdminUserManagementTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
  currentUserId?: string;
}

interface UserFilterDraft {
  role: string;
  status: string;
}

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };

  return (
    maybeError?.response?.data?.message ||
    maybeError?.response?.data?.error ||
    maybeError?.message ||
    fallback
  );
}

function getRoleBadgeVariant(role: UserRole): "default" | "secondary" | "outline" {
  if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
    return "default";
  }

  if (role === UserRole.OWNER) {
    return "secondary";
  }

  return "outline";
}

function getStatusBadgeVariant(status: UserStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === UserStatus.ACTIVE) {
    return "default";
  }

  if (status === UserStatus.SUSPENDED || status === UserStatus.DELETED) {
    return "destructive";
  }

  if (status === UserStatus.INACTIVE) {
    return "secondary";
  }

  return "outline";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminUserManagementTable({
  queryString,
  queryParamsObject,
  currentUserId,
}: AdminUserManagementTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedUserForEdit, setSelectedUserForEdit] = useState<IUser | null>(null);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<IUser | null>(null);
  const [editFormData, setEditFormData] = useState<IUpdateUserPayload>({
    name: "",
    email: "",
    role: UserRole.CONSUMER,
    status: UserStatus.ACTIVE,
  });

  const [draftFilters, setDraftFilters] = useState<UserFilterDraft>({
    role: String(getFirst(queryParamsObject.role) ?? "all"),
    status: String(getFirst(queryParamsObject.status) ?? "all"),
  });

  const {
    isNavigationPending,
    sortingState,
    paginationState,
    searchTermState,
    optimisticSorting,
    optimisticPagination,
    optimisticSearchTerm,
    handleSortingChange,
    handlePaginationChange,
    handleSearchChange,
  } = useUrlDataTableControls({
    queryParamsObject,
    searchParams,
    pathname,
    router,
    defaultPageSize: 10,
  });

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["admin-users", queryString],
    queryFn: () => getAllUsers(queryString),
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: updateUserMutation, isPending: isUpdatingUser } = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: IUpdateUserPayload }) =>
      updateUser(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated successfully");
    },
  });

  const { mutateAsync: deleteUserMutation, isPending: isDeletingUser } = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted successfully");
      setSelectedUserForDelete(null);
    },
  });

  const users = data?.data ?? [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showLoadingState = isLoading || isFetching || isNavigationPending;

  const activeFilterCount =
    (getFirst(queryParamsObject.role) ? 1 : 0) +
    (getFirst(queryParamsObject.status) ? 1 : 0);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (draftFilters.role && draftFilters.role !== "all") {
      params.set("role", draftFilters.role);
    } else {
      params.delete("role");
    }

    if (draftFilters.status && draftFilters.status !== "all") {
      params.set("status", draftFilters.status);
    } else {
      params.delete("status");
    }

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    setDraftFilters({ role: "all", status: "all" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("role");
    params.delete("status");
    params.set("page", "1");

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleStatusToggle = async (user: IUser) => {
    if (currentUserId && user.id === currentUserId) {
      toast.error("You cannot ban or unban your own admin account.");
      return;
    }

    const nextStatus =
      user.status === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED;

    try {
      await updateUserMutation({
        userId: user.id,
        payload: { status: nextStatus },
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update user status"));
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedUserForEdit) {
      return;
    }

    try {
      await updateUserMutation({
        userId: selectedUserForEdit.id,
        payload: {
          name: editFormData.name?.trim(),
          email: editFormData.email?.trim(),
          role: editFormData.role,
          status: editFormData.status,
        },
      });
      setSelectedUserForEdit(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update user"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserForDelete) {
      return;
    }

    if (currentUserId && selectedUserForDelete.id === currentUserId) {
      toast.error("You cannot delete your own admin account from this panel.");
      setSelectedUserForDelete(null);
      return;
    }

    try {
      await deleteUserMutation(selectedUserForDelete.id);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to delete user"));
    }
  };

  const columns: ColumnDef<IUser>[] = [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          const isCurrentUser = Boolean(currentUserId && user.id === currentUserId);

          return (
            <div className="flex items-center gap-3">
              <Avatar size="default" className="size-9">
                <AvatarImage src={user.profilePhoto ?? ""} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-[10px]">
                    Current account
                  </Badge>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const user = row.original;
          return <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const user = row.original;
          return <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;
          const isCurrentUser = Boolean(currentUserId && user.id === currentUserId);
          const isSuspended = user.status === UserStatus.SUSPENDED;

          return (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditFormData({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                  });
                  setSelectedUserForEdit(user);
                }}
                disabled={isUpdatingUser || isDeletingUser}
              >
                Edit
              </Button>

              {isCurrentUser ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button
                          type="button"
                          size="sm"
                          variant={isSuspended ? "default" : "secondary"}
                          disabled
                        >
                          {isSuspended ? "Unban" : "Ban"}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>
                      You cannot change your own account status here.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant={isSuspended ? "default" : "secondary"}
                  onClick={() => {
                    void handleStatusToggle(user);
                  }}
                  disabled={isUpdatingUser || isDeletingUser}
                >
                  {isSuspended ? "Unban" : "Ban"}
                </Button>
              )}

              {isCurrentUser ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0}>
                        <Button type="button" size="sm" variant="destructive" disabled>
                          Delete
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}>
                      You cannot delete your own account from this panel.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelectedUserForDelete(user);
                  }}
                  disabled={isUpdatingUser || isDeletingUser}
                >
                  Delete
                </Button>
              )}
            </div>
          );
        },
      },
    ];

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load users"
            description="Please retry or refresh the page."
            error={error instanceof Error ? error : undefined}
            retry={() => {
              void refetch();
            }}
            variant="card"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable<IUser>
          data={users}
          columns={columns}
          isLoading={showLoadingState}
          loadingRowCount={6}
          renderLoadingCell={({ column, columnIndex }) => {
            const columnId = String(column.id ?? "");

            if (columnIndex === 0) {
              return (
                <div className="flex items-center gap-3 py-1">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
              );
            }

            if (columnId === "actions") {
              return (
                <div className="flex items-center gap-2 py-1">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-14" />
                  <Skeleton className="h-8 w-14" />
                </div>
              );
            }

            return <Skeleton className="h-4 w-full" />;
          }}
          emptyMessage="No users found for this query."
          search={{
            value: activeSearchTerm,
            onSearchChange: handleSearchChange,
            placeholder: "Search by name or email...",
            debounceMs: 500,
          }}
          filters={
            <DataTableFilterPopover
              activeCount={activeFilterCount}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              title="Filter users"
              description="Filter users by role and account status."
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Role</p>
                  <Select
                    value={draftFilters.role}
                    onValueChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        role: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All roles</SelectItem>
                      <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                      <SelectItem value={UserRole.CONSUMER}>Consumer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Select
                    value={draftFilters.status}
                    onValueChange={(value) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                      <SelectItem value={UserStatus.DELETED}>Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DataTableFilterPopover>
          }
          pagination={{
            state: activePaginationState,
            pageCount: totalPages,
            totalItems,
            onPaginationChange: handlePaginationChange,
          }}
          sorting={{
            state: activeSortingState,
            onSortingChange: handleSortingChange,
          }}
        />

        <Dialog
          open={Boolean(selectedUserForEdit)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedUserForEdit(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update profile, role, and account status for this user.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Name</p>
                <Input
                  value={editFormData.name ?? ""}
                  onChange={(event) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter user name"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Email</p>
                <Input
                  type="email"
                  value={editFormData.email ?? ""}
                  onChange={(event) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Enter user email"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Role</p>
                  <Select
                    value={editFormData.role}
                    onValueChange={(value) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        role: value as UserRole,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                      <SelectItem value={UserRole.CONSUMER}>Consumer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm font-medium">Status</p>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        status: value as UserStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
                      <SelectItem value={UserStatus.DELETED}>Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedUserForEdit(null)}
                disabled={isUpdatingUser}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => void handleEditSubmit()} disabled={isUpdatingUser}>
                {isUpdatingUser ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={Boolean(selectedUserForDelete)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedUserForDelete(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The user account and associated access will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingUser}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={(event) => {
                  event.preventDefault();
                  void handleDeleteConfirm();
                }}
                disabled={isDeletingUser}
              >
                {isDeletingUser ? "Deleting..." : "Delete User"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
