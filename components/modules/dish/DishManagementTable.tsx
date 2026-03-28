"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
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

import { dishColumns } from "./dishColumns";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface DishManagementTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
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

export default function DishManagementTable({
  queryString,
  queryParamsObject,
}: DishManagementTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDishForView, setSelectedDishForView] = useState<IDish | null>(
    null,
  );
  const [selectedDishForEdit, setSelectedDishForEdit] = useState<IDish | null>(
    null,
  );
  const [selectedDishForDelete, setSelectedDishForDelete] = useState<IDish | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(
    String(getFirst(queryParamsObject.search) ?? ""),
  );
  const [selectedRestaurantFilter, setSelectedRestaurantFilter] = useState(
    String(getFirst(queryParamsObject.restaurantId) ?? "all"),
  );

  const { data: dishesResponse, isLoading: isDishesLoading } = useQuery({
    queryKey: ["my-dishes", queryString],
    queryFn: () => getMyDishes(queryString),
  });

  const { data: restaurantsResponse } = useQuery({
    queryKey: ["my-restaurants-common"],
    queryFn: () => getMyRestaurants("limit=200"),
  });

  const createDishMutation = useMutation({
    mutationFn: async (variables: {
      payload: ICreateDishPayload;
      image?: File;
    }) => {
      return createDish(variables.payload, variables.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-dishes"] });
      setIsCreateDialogOpen(false);
      toast.success("Dish created successfully");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Failed to create dish");
      toast.error(message);
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: async (variables: {
      dishId: string;
      payload: IUpdateDishPayload;
      image?: File;
    }) => {
      return updateMyDish(variables.dishId, variables.payload, variables.image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-dishes"] });
      setSelectedDishForEdit(null);
      toast.success("Dish updated successfully");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Failed to update dish");
      toast.error(message);
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: async (dishId: string) => {
      return deleteMyDish(dishId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-dishes"] });
      setSelectedDishForDelete(null);
      toast.success("Dish deleted successfully");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Failed to delete dish");
      toast.error(message);
    },
  });

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    if (selectedRestaurantFilter && selectedRestaurantFilter !== "all") {
      params.set("restaurantId", selectedRestaurantFilter);
    } else {
      params.delete("restaurantId");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  if (isDishesLoading) {
    return <div className="space-y-4">Loading dishes...</div>;
  }

  if (!dishesResponse?.success) {
    return (
      <ErrorState 
        title="Failed to load dishes"
        description={dishesResponse?.message || "An error occurred while loading dishes"}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dish Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Create Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search Dishes</label>
            <Input
              placeholder="Search by dish name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Restaurant</label>
            <Select
              value={selectedRestaurantFilter}
              onValueChange={setSelectedRestaurantFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Restaurants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Restaurants</SelectItem>
                {restaurantsResponse?.data?.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleApplyFilters}
            className="w-full sm:w-auto"
          >
            Apply Filters
          </Button>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={createDishMutation.isPending}
            className="w-full sm:w-auto"
          >
            + Create Dish
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={dishColumns}
          data={dishesResponse.data || []}
          isLoading={isDishesLoading}
          emptyMessage="No dishes found for this query."
          actions={{
            onView: (dish) => setSelectedDishForView(dish),
            onEdit: (dish) => setSelectedDishForEdit(dish),
            onDelete: (dish) => setSelectedDishForDelete(dish),
          }}
        />

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Dish</DialogTitle>
              <DialogDescription>
                Add a new dish to your restaurant
              </DialogDescription>
            </DialogHeader>
            <CreateDishForm
              isPending={createDishMutation.isPending}
              restaurants={restaurantsResponse?.data ?? []}
              onSubmit={async (payload, image) => {
                await createDishMutation.mutateAsync({
                  payload: payload as ICreateDishPayload,
                  image,
                });
              }}
            />
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog
          open={!!selectedDishForView}
          onOpenChange={(open) => !open && setSelectedDishForView(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDishForView?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDishForView?.image && (
                <div className="flex justify-center">
                  <img
                    src={selectedDishForView.image}
                    alt={selectedDishForView.name}
                    className="max-h-64 rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Price
                  </p>
                  <p className="text-lg font-semibold">
                    ${selectedDishForView?.price?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm">
                    {selectedDishForView?.description || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Rating
                  </p>
                  <p className="text-sm">
                    {Number(selectedDishForView?.ratingAvg || 0).toFixed(1)}/5 (
                    {selectedDishForView?.totalReviews ?? 0} reviews)
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDishForView(null);
                  setSelectedDishForEdit(selectedDishForView);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedDishForView(null);
                  setSelectedDishForDelete(selectedDishForView);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!selectedDishForEdit}
          onOpenChange={(open) => !open && setSelectedDishForEdit(null)}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Dish</DialogTitle>
              <DialogDescription>
                Update dish information
              </DialogDescription>
            </DialogHeader>
            <CreateDishForm
              isPending={updateDishMutation.isPending}
              restaurants={restaurantsResponse?.data ?? []}
              initialDish={selectedDishForEdit}
              onSubmit={async (payload, image) => {
                await updateDishMutation.mutateAsync({
                  dishId: selectedDishForEdit?.id ?? "",
                  payload: payload as IUpdateDishPayload,
                  image,
                });
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!selectedDishForDelete}
          onOpenChange={(open) => !open && setSelectedDishForDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Dish</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedDishForDelete?.name}"?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteDishMutation.mutate(selectedDishForDelete?.id ?? "");
                }}
                disabled={deleteDishMutation.isPending}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
