"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
import DataTableFilterPopover from "@/components/layout/data-table/DataTableFilterPopOver";
import useUrlDataTableControls from "@/components/layout/data-table/UseUrlDataTableControls";
import DataTable from "@/components/layout/data-show/DataTable";
import CreateDishForm from "@/components/layout/forms/CreateDishForm";
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
import { dishColumns } from "@/components/modules/dish/dishColumns";
import {
  createDish,
  deleteMyDish,
  getMyDishes,
  updateMyDish,
} from "@/services/dish.services";
import { getMyRestaurants } from "@/services/restaurant.services";
import {
  ICreateDishPayload,
  IDish,
  IUpdateDishPayload,
} from "@/types/dish.types";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface OwnerDishManagementTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
}

interface DishFilterDraft {
  restaurantId: string;
  price: string;
  ratingAvg: string;
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

export default function OwnerDishManagementTable({
  queryString,
  queryParamsObject,
}: OwnerDishManagementTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedDishForEdit, setSelectedDishForEdit] = useState<IDish | null>(null);
  const [selectedDishForDelete, setSelectedDishForDelete] = useState<IDish | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [draftFilters, setDraftFilters] = useState<DishFilterDraft>({
    restaurantId: String(getFirst(queryParamsObject.restaurantId) ?? "all"),
    price: String(getFirst(queryParamsObject.price) ?? ""),
    ratingAvg: String(getFirst(queryParamsObject.ratingAvg) ?? "all"),
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
    queryKey: ["my-dishes", queryString],
    queryFn: () => getMyDishes(queryString),
    placeholderData: (previousData) => previousData,
  });

  const { data: restaurantsResponse } = useQuery({
    queryKey: ["my-restaurants-common"],
    queryFn: () => getMyRestaurants("limit=200"),
  });

  const ownedRestaurantIds = useMemo(
    () => new Set((restaurantsResponse?.data ?? []).map((restaurant) => restaurant.id)),
    [restaurantsResponse?.data],
  );

  const { mutateAsync: createDishMutation, isPending: isCreatingDish } = useMutation({
    mutationFn: ({ payload, image }: { payload: ICreateDishPayload; image?: File }) =>
      createDish(payload, image),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-dishes"] });
      toast.success("Dish created successfully");
      setIsCreateDialogOpen(false);
    },
  });

  const { mutateAsync: updateDishMutation, isPending: isUpdatingDish } = useMutation({
    mutationFn: ({
      dishId,
      payload,
      image,
    }: {
      dishId: string;
      payload: IUpdateDishPayload;
      image?: File;
    }) => updateMyDish(dishId, payload, image),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-dishes"] });
      toast.success("Dish updated successfully");
      setSelectedDishForEdit(null);
    },
  });

  const { mutateAsync: deleteDishMutation, isPending: isDeletingDish } = useMutation({
    mutationFn: deleteMyDish,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-dishes"] });
      toast.success("Dish deleted successfully");
      setSelectedDishForDelete(null);
    },
  });

  const dishes = data?.data ?? [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showLoadingState = isLoading || isFetching || isNavigationPending;

  const activeFilterCount =
    (getFirst(queryParamsObject.restaurantId) ? 1 : 0) +
    (getFirst(queryParamsObject.price) ? 1 : 0) +
    (getFirst(queryParamsObject.ratingAvg) ? 1 : 0);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (draftFilters.restaurantId && draftFilters.restaurantId !== "all") {
      params.set("restaurantId", draftFilters.restaurantId);
    } else {
      params.delete("restaurantId");
    }

    if (draftFilters.price.trim()) {
      params.set("price", draftFilters.price.trim());
    } else {
      params.delete("price");
    }

    if (draftFilters.ratingAvg && draftFilters.ratingAvg !== "all") {
      params.set("ratingAvg", draftFilters.ratingAvg);
    } else {
      params.delete("ratingAvg");
    }

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    setDraftFilters({ restaurantId: "all", price: "", ratingAvg: "all" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("restaurantId");
    params.delete("price");
    params.delete("ratingAvg");
    params.set("page", "1");

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleCreateSubmit = async (
    payload: ICreateDishPayload | IUpdateDishPayload,
    image?: File,
  ) => {
    const createPayload = payload as ICreateDishPayload;

    if (!ownedRestaurantIds.has(createPayload.restaurantId)) {
      toast.error("You can add dishes only to your own restaurants");
      return;
    }

    try {
      await createDishMutation({
        payload: createPayload,
        image,
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to create dish"));
    }
  };

  const handleUpdateSubmit = async (
    payload: ICreateDishPayload | IUpdateDishPayload,
    image?: File,
  ) => {
    if (!selectedDishForEdit) {
      return;
    }

    try {
      await updateDishMutation({
        dishId: selectedDishForEdit.id,
        payload,
        image,
      });
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update dish"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDishForDelete) {
      return;
    }

    try {
      await deleteDishMutation(selectedDishForDelete.id);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to delete dish"));
    }
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Dishes</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load dishes"
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
        <CardTitle>My Dishes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable<IDish>
          data={dishes}
          columns={dishColumns}
          isLoading={showLoadingState}
          emptyMessage="No dishes found for this query."
          search={{
            value: activeSearchTerm,
            onSearchChange: handleSearchChange,
            placeholder: "Search by name, description, tags, ingredients...",
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
                Create Dish
              </Button>

              <DataTableFilterPopover
                activeCount={activeFilterCount}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                title="Filter dishes"
                description="Filter by your restaurants, price, and average rating."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Restaurant</p>
                    <Select
                      value={draftFilters.restaurantId}
                      onValueChange={(value) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          restaurantId: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue placeholder="All restaurants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All restaurants</SelectItem>
                        {restaurantsResponse?.data?.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Price</p>
                    <Input
                      value={draftFilters.price}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                      placeholder="Filter by price"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Rating</p>
                    <Select
                      value={draftFilters.ratingAvg}
                      onValueChange={(value) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          ratingAvg: value,
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
            onView: (dish) => router.push(`/owner/dashboard/dishes/${dish.id}`),
            onEdit: (dish) => setSelectedDishForEdit(dish),
            onDelete: (dish) => setSelectedDishForDelete(dish),
          }}
        />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Dish</DialogTitle>
              <DialogDescription>
                Add a new dish for one of your own restaurants.
              </DialogDescription>
            </DialogHeader>
            <CreateDishForm
              isPending={isCreatingDish}
              restaurants={restaurantsResponse?.data ?? []}
              onSubmit={handleCreateSubmit}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(selectedDishForEdit)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedDishForEdit(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Dish</DialogTitle>
              <DialogDescription>
                Update dish information and media.
              </DialogDescription>
            </DialogHeader>
            <CreateDishForm
              initialDish={selectedDishForEdit}
              isPending={isUpdatingDish}
              restaurants={restaurantsResponse?.data ?? []}
              onSubmit={handleUpdateSubmit}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={Boolean(selectedDishForDelete)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Dish</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete the selected dish. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedDishForDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void handleDeleteConfirm()}
                disabled={isDeletingDish}
                variant="destructive"
              >
                {isDeletingDish ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
