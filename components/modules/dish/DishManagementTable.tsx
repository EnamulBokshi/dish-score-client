"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DollarSign, Layers3, Star, Tags, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

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
    String(getFirst(queryParamsObject.searchTerm) ?? ""),
  );
  const [nameFilter, setNameFilter] = useState(
    String(getFirst(queryParamsObject.name) ?? ""),
  );
  const [selectedRestaurantFilter, setSelectedRestaurantFilter] = useState(
    String(getFirst(queryParamsObject.restaurantId) ?? "all"),
  );
  const [priceFilter, setPriceFilter] = useState(
    String(getFirst(queryParamsObject.price) ?? ""),
  );
  const [ratingAvgFilter, setRatingAvgFilter] = useState(
    String(getFirst(queryParamsObject.ratingAvg) ?? "all"),
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

  const dishes = dishesResponse?.data ?? [];

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("searchTerm", searchTerm);
    } else {
      params.delete("searchTerm");
    }
    if (nameFilter.trim()) {
      params.set("name", nameFilter.trim());
    } else {
      params.delete("name");
    }
    if (selectedRestaurantFilter && selectedRestaurantFilter !== "all") {
      params.set("restaurantId", selectedRestaurantFilter);
    } else {
      params.delete("restaurantId");
    }
    if (priceFilter.trim()) {
      params.set("price", priceFilter.trim());
    } else {
      params.delete("price");
    }
    if (ratingAvgFilter && ratingAvgFilter !== "all") {
      params.set("ratingAvg", ratingAvgFilter);
    } else {
      params.delete("ratingAvg");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  if (dishesResponse && !dishesResponse.success) {
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
              placeholder="Search name, description, tags, ingredients, reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Name (exact filter)</label>
            <Input
              placeholder="Filter by exact/partial name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
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

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Filter by price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Rating Avg</label>
            <Select value={ratingAvgFilter} onValueChange={setRatingAvgFilter}>
              <SelectTrigger>
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
          data={dishes}
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
          <DialogContent className="sm:max-w-2xl border border-dark-border bg-dark-card/95 p-0 text-[#f4f4f5] backdrop-blur-lg">
            <DialogHeader>
              <div className="border-b border-dark-border px-6 pt-6 pb-4">
                <DialogTitle className="text-xl text-white">{selectedDishForView?.name}</DialogTitle>
                <DialogDescription className="mt-1 text-[#a3a3ad]">
                  Detailed dish information and performance snapshot.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-5 px-6 pb-6">
              {selectedDishForView?.image && (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/3">
                  <div className="relative h-72 w-full">
                    <Image
                      src={selectedDishForView.image}
                      alt={selectedDishForView.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <DollarSign className="h-3.5 w-3.5" /> Price
                  </p>
                  <p className="text-lg font-semibold text-white">${selectedDishForView?.price?.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <Star className="h-3.5 w-3.5" /> Rating
                  </p>
                  <p className="text-sm text-white">
                    {Number(selectedDishForView?.ratingAvg || 0).toFixed(1)}/5
                    <span className="ml-2 text-[#b9b9c4]">({selectedDishForView?.totalReviews ?? 0} reviews)</span>
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 md:col-span-2">
                  <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <UtensilsCrossed className="h-3.5 w-3.5" /> Description
                  </p>
                  <p className="text-sm leading-relaxed text-[#e7e7ee]">{selectedDishForView?.description || "-"}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <Tags className="h-3.5 w-3.5" /> Tags
                  </p>
                  {selectedDishForView?.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedDishForView.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-[#d9d9e3]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#b9b9c4]">No tags</p>
                  )}
                </div>

                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <Layers3 className="h-3.5 w-3.5" /> Ingredients
                  </p>
                  {selectedDishForView?.ingredients?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedDishForView.ingredients.map((ingredient) => (
                        <span key={ingredient} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-[#d9d9e3]">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#b9b9c4]">No ingredients listed</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 border-t border-dark-border bg-dark-card/70 px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDishForView(null);
                  setSelectedDishForEdit(selectedDishForView);
                }}
                className="border-white/15 bg-white/3 text-white hover:bg-white/10"
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
          <DialogContent className="max-h-[90vh] overflow-y-auto border border-dark-border bg-dark-card/95 p-0 text-[#f4f4f5] backdrop-blur-lg sm:max-w-2xl">
            <DialogHeader>
              <div className="border-b border-dark-border px-6 pt-6 pb-4">
                <DialogTitle className="text-xl text-white">Edit Dish</DialogTitle>
                <DialogDescription className="mt-1 text-[#a3a3ad]">
                  Update dish information, pricing, media, and metadata.
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="px-6 pb-6 pt-2">
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
            </div>
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
                Are you sure you want to delete dish: {selectedDishForDelete?.name || "Unknown"}?
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
