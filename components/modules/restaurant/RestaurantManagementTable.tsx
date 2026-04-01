"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
import DataTableFilterPopover from "@/components/layout/data-table/DataTableFilterPopOver";
import useUrlDataTableControls from "@/components/layout/data-table/UseUrlDataTableControls";
import DataTable from "@/components/layout/data-show/DataTable";
import CreateRestaurantForm from "@/components/layout/forms/CreateRestaurantForm";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  createRestaurant,
  deleteMyRestaurant,
  getMyRestaurants,
  updateMyRestaurant,
} from "@/services/restaurant.services";
import {
  ICreateRestaurantPayload,
  IRestaurant,
  IUpdateRestaurantPayload,
} from "@/types/restaurant.types";

import { restaurantColumns } from "./restaurantCoulmn";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface RestaurantManagementTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
}

interface RestaurantFilterDraft {
  city: string;
  state: string;
  ratingAvg: string;
}

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return maybeError?.response?.data?.message || maybeError?.response?.data?.error || maybeError?.message || fallback;
}

export default function RestaurantManagementTable({
  queryString,
  queryParamsObject,
}: RestaurantManagementTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedRestaurantForEdit, setSelectedRestaurantForEdit] = useState<IRestaurant | null>(null);
  const [selectedRestaurantForDelete, setSelectedRestaurantForDelete] = useState<IRestaurant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState<RestaurantFilterDraft>({
    city: String(getFirst(queryParamsObject.city) ?? ""),
    state: String(getFirst(queryParamsObject.state) ?? ""),
    ratingAvg: String(getFirst(queryParamsObject.ratingAvg) ?? ""),
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
    queryKey: ["my-restaurants", queryString],
    queryFn: () => getMyRestaurants(queryString),
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: createRestaurantMutation, isPending: isCreatingRestaurant } = useMutation({
    mutationFn: ({ payload, images }: { payload: ICreateRestaurantPayload; images: File[] }) =>
      createRestaurant(payload, images),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-restaurants"] });
      toast.success("Restaurant created successfully");
      setIsCreateDialogOpen(false);
    },
  });

  const { mutateAsync: updateRestaurantMutation, isPending: isUpdatingRestaurant } = useMutation({
    mutationFn: ({
      restaurantId,
      payload,
      images,
    }: {
      restaurantId: string;
      payload: IUpdateRestaurantPayload;
      images: File[];
    }) => updateMyRestaurant(restaurantId, payload, images),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-restaurants"] });
      toast.success("Restaurant updated successfully");
      setSelectedRestaurantForEdit(null);
    },
  });

  const { mutateAsync: deleteRestaurantMutation, isPending: isDeletingRestaurant } = useMutation({
    mutationFn: deleteMyRestaurant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-restaurants"] });
      toast.success("Restaurant deleted successfully");
      setSelectedRestaurantForDelete(null);
    },
  });

  const restaurants = data?.data ?? [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showLoadingState = isLoading || isFetching || isNavigationPending;

  const activeFilterCount =
    (getFirst(queryParamsObject.city) ? 1 : 0) +
    (getFirst(queryParamsObject.state) ? 1 : 0) +
    (getFirst(queryParamsObject.ratingAvg) ? 1 : 0);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (draftFilters.city.trim()) {
      params.set("city", draftFilters.city.trim());
    } else {
      params.delete("city");
    }

    if (draftFilters.state.trim()) {
      params.set("state", draftFilters.state.trim());
    } else {
      params.delete("state");
    }

    if (draftFilters.ratingAvg) {
      params.set("ratingAvg", draftFilters.ratingAvg);
    } else {
      params.delete("ratingAvg");
    }

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    setDraftFilters({ city: "", state: "", ratingAvg: "" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("city");
    params.delete("state");
    params.delete("ratingAvg");
    params.set("page", "1");

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleCreateSubmit = async (
    payload: ICreateRestaurantPayload | IUpdateRestaurantPayload,
    images: File[],
  ) => {
    try {
      await createRestaurantMutation({
        payload: payload as ICreateRestaurantPayload,
        images,
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to create restaurant"));
    }
  };

  const handleUpdateSubmit = async (
    payload: ICreateRestaurantPayload | IUpdateRestaurantPayload,
    images: File[],
  ) => {
    if (!selectedRestaurantForEdit) {
      return;
    }

    try {
      await updateRestaurantMutation({
        restaurantId: selectedRestaurantForEdit.id,
        payload,
        images,
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update restaurant"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRestaurantForDelete) {
      return;
    }

    try {
      await deleteRestaurantMutation(selectedRestaurantForDelete.id);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to delete restaurant"));
    }
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load restaurants"
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
        <CardTitle>Restaurant Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable<IRestaurant>
          data={restaurants}
          columns={restaurantColumns}
          isLoading={showLoadingState}
          emptyMessage="No restaurants found for this query."
          search={{
            value: activeSearchTerm,
            onSearchChange: handleSearchChange,
            placeholder: "Search by name, city, state, address...",
            debounceMs: 500,
          }}
          filters={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                className="btn-neon-primary h-8"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create Restaurant
              </Button>

              <DataTableFilterPopover
                activeCount={activeFilterCount}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                title="Filter restaurants"
                description="Filter by city, state, and average rating."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">City</p>
                    <Input
                      value={draftFilters.city}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          city: event.target.value,
                        }))
                      }
                      placeholder="Filter by city"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">State</p>
                    <Input
                      value={draftFilters.state}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          state: event.target.value,
                        }))
                      }
                      placeholder="Filter by state"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Rating</p>
                    <Select
                      value={draftFilters.ratingAvg || "all"}
                      onValueChange={(value) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          ratingAvg: value === "all" ? "" : value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue placeholder="All ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DataTableFilterPopover>
            </div>
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
          actions={{
            onView: (restaurant) => router.push(`/restaurants/${restaurant.id}`),
            onEdit: (restaurant) => setSelectedRestaurantForEdit(restaurant),
            onDelete: (restaurant) => setSelectedRestaurantForDelete(restaurant),
          }}
        />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Restaurant</DialogTitle>
              <DialogDescription>
                Add your restaurant profile with location and images.
              </DialogDescription>
            </DialogHeader>
            <CreateRestaurantForm
              isPending={isCreatingRestaurant}
              onSubmit={handleCreateSubmit}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(selectedRestaurantForEdit)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRestaurantForEdit(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Restaurant</DialogTitle>
              <DialogDescription>
                Update your restaurant information.
              </DialogDescription>
            </DialogHeader>
            <CreateRestaurantForm
              initialRestaurant={selectedRestaurantForEdit}
              isPending={isUpdatingRestaurant}
              onSubmit={handleUpdateSubmit}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={Boolean(selectedRestaurantForDelete)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Restaurant</AlertDialogTitle>
              <AlertDialogDescription>
                This will soft-delete your restaurant profile. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedRestaurantForDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void handleDeleteConfirm()}
                disabled={isDeletingRestaurant}
                variant="destructive"
              >
                {isDeletingRestaurant ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
