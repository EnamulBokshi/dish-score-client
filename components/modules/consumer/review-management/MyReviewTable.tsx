"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import DataTable from "@/components/layout/data-show/DataTable";
import useUrlDataTableControls from "@/components/layout/data-table/UseUrlDataTableControls";
import DataTableFilterPopover from "@/components/layout/data-table/DataTableFilterPopOver";
import { ErrorState } from "@/components/common/ErrorState";
import CreateReviewDialog from "@/components/modules/consumer/review-management/CreateReviewDialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  deleteMyReview,
  getMyReviews,
  updateMyReview,
} from "@/services/review.services";
import { IReview } from "@/types/review.types";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface ReviewTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
}

interface ReviewFilterDraft {
  rating: string;
  restaurantId: string;
  dishId: string;
}

interface EditReviewFormState {
  rating: string;
  comment: string;
  tags: string;
}

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

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

function getInitialEditForm(review: IReview | null): EditReviewFormState {
  if (!review) {
    return { rating: "5", comment: "", tags: "" };
  }

  return {
    rating: String(review.rating),
    comment: review.comment ?? "",
    tags: review.tags?.join(", ") ?? "",
  };
}

function parseTagsInput(tagsText: string): string[] | undefined {
  const normalized = tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (normalized.length === 0) {
    return undefined;
  }

  return Array.from(new Set(normalized));
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const maybeError = error as { response?: { data?: { message?: string; error?: string } } };
  return maybeError?.response?.data?.message || maybeError?.response?.data?.error || fallback;
}

export default function MyReviewTable({
  queryString,
  queryParamsObject,
}: ReviewTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftFilters, setDraftFilters] = useState<ReviewFilterDraft>({
    rating: String(getFirst(queryParamsObject.rating) ?? ""),
    restaurantId: String(getFirst(queryParamsObject.restaurantId) ?? ""),
    dishId: String(getFirst(queryParamsObject.dishId) ?? ""),
  });

  const [selectedReviewForView, setSelectedReviewForView] = useState<IReview | null>(null);
  const [selectedReviewForEdit, setSelectedReviewForEdit] = useState<IReview | null>(null);
  const [selectedReviewForDelete, setSelectedReviewForDelete] = useState<IReview | null>(null);
  const [editFormState, setEditFormState] = useState<EditReviewFormState>({ rating: "5", comment: "", tags: "" });

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
    queryKey: ["my-reviews", queryString],
    queryFn: () => getMyReviews(queryString),
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: deleteReviewMutation, isPending: isDeletingReview } =
    useMutation({
      mutationFn: deleteMyReview,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      },
    });

  const { mutateAsync: updateReviewMutation, isPending: isUpdatingReview } =
    useMutation({
      mutationFn: ({ reviewId, payload }: { reviewId: string; payload: { rating: number; comment?: string; tags?: string[] } }) =>
        updateMyReview(reviewId, payload),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      },
    });

  const reviews = data?.data ?? [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showLoadingState = isLoading || isFetching || isNavigationPending;

  const activeFilterCount =
    (getFirst(queryParamsObject.rating) ? 1 : 0) +
    (getFirst(queryParamsObject.restaurantId) ? 1 : 0) +
    (getFirst(queryParamsObject.dishId) ? 1 : 0);

  const reviewColumns = useMemo<ColumnDef<IReview>[]>(
    () => [
      {
        id: "restaurant.name",
        header: "Restaurant",
        accessorFn: (row) => row.restaurant?.name ?? "-",
        cell: ({ row }) => <span className="font-medium">{row.original.restaurant?.name ?? "-"}</span>,
      },
      {
        id: "dish.name",
        header: "Dish",
        accessorFn: (row) => row.dish?.name ?? "-",
        cell: ({ row }) => row.original.dish?.name ?? "-",
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => {
          const rating = row.original.rating;
          return <Badge variant="secondary">{rating}/5</Badge>;
        },
      },
      {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => {
          const comment = row.original.comment?.trim();
          return (
            <span className="block max-w-[24rem] truncate text-sm text-muted-foreground">
              {comment || "No comment"}
            </span>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDateLabel(row.original.createdAt),
      },
    ],
    [],
  );

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (draftFilters.rating) {
      params.set("rating", draftFilters.rating);
    } else {
      params.delete("rating");
    }

    if (draftFilters.restaurantId.trim()) {
      params.set("restaurantId", draftFilters.restaurantId.trim());
    } else {
      params.delete("restaurantId");
    }

    if (draftFilters.dishId.trim()) {
      params.set("dishId", draftFilters.dishId.trim());
    } else {
      params.delete("dishId");
    }

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    setDraftFilters({ rating: "", restaurantId: "", dishId: "" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("rating");
    params.delete("restaurantId");
    params.delete("dishId");
    params.set("page", "1");

    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const openEditDialog = (review: IReview) => {
    setSelectedReviewForEdit(review);
    setEditFormState(getInitialEditForm(review));
  };

  const handleSaveEdit = async () => {
    if (!selectedReviewForEdit) {
      return;
    }

    const parsedRating = Number(editFormState.rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      toast.error("Rating must be an integer between 1 and 5");
      return;
    }

    try {
      await updateReviewMutation({
        reviewId: selectedReviewForEdit.id,
        payload: {
          rating: parsedRating,
          comment: editFormState.comment.trim() || undefined,
          tags: parseTagsInput(editFormState.tags),
        },
      });
      toast.success("Review updated successfully");
      setSelectedReviewForEdit(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to update review"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedReviewForDelete) {
      return;
    }

    try {
      await deleteReviewMutation(selectedReviewForDelete.id);
      toast.success("Review deleted successfully");
      setSelectedReviewForDelete(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError, "Failed to delete review"));
    }
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load your reviews"
            description="Please try again. If the problem continues, check your connection or refresh the page."
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
        <CardTitle>My Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable<IReview>
          data={reviews}
          columns={reviewColumns}
          isLoading={showLoadingState}
          emptyMessage="No reviews found for the current query."
          search={{
            value: activeSearchTerm,
            onSearchChange: handleSearchChange,
            placeholder: "Search by dish, restaurant, or comment...",
            debounceMs: 500,
          }}
          filters={
            <div className="flex items-center gap-2">
              <CreateReviewDialog queryKey={["my-reviews"]} />
              <DataTableFilterPopover
                activeCount={activeFilterCount}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                title="Filter reviews"
                description="Filter by rating and specific restaurant or dish IDs."
              >
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Rating</p>
                    <Select
                      value={draftFilters.rating || "all"}
                      onValueChange={(value) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          rating: value === "all" ? "" : value,
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

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Restaurant ID</p>
                    <Input
                      value={draftFilters.restaurantId}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          restaurantId: event.target.value,
                        }))
                      }
                      placeholder="Filter by restaurant id"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Dish ID</p>
                    <Input
                      value={draftFilters.dishId}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          dishId: event.target.value,
                        }))
                      }
                      placeholder="Filter by dish id"
                    />
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
            onView: (review) => setSelectedReviewForView(review),
            onEdit: openEditDialog,
            onDelete: (review) => setSelectedReviewForDelete(review),
          }}
        />

        <Dialog
          open={Boolean(selectedReviewForView)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedReviewForView(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>Detailed information for the selected review.</DialogDescription>
            </DialogHeader>

            {selectedReviewForView && (
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Restaurant:</span> {selectedReviewForView.restaurant?.name || "-"}
                </p>
                <p>
                  <span className="font-medium">Dish:</span> {selectedReviewForView.dish?.name || "-"}
                </p>
                <p>
                  <span className="font-medium">Rating:</span> {selectedReviewForView.rating}/5
                </p>
                <p>
                  <span className="font-medium">Comment:</span>{" "}
                  {selectedReviewForView.comment?.trim() || "No comment"}
                </p>
                <p>
                  <span className="font-medium">Created:</span> {formatDateLabel(selectedReviewForView.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Likes:</span> {selectedReviewForView.likes.length}
                </p>
                <p>
                  <span className="font-medium">Tags:</span>{" "}
                  {selectedReviewForView.tags?.length ? selectedReviewForView.tags.join(", ") : "-"}
                </p>
              </div>
            )}

            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>

        <Dialog
          open={Boolean(selectedReviewForEdit)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedReviewForEdit(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Review</DialogTitle>
              <DialogDescription>Update your rating and comment for this review.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Rating</p>
                <Select
                  value={editFormState.rating}
                  onValueChange={(value) =>
                    setEditFormState((prev) => ({
                      ...prev,
                      rating: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full" size="sm">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Comment</p>
                <Textarea
                  rows={5}
                  value={editFormState.comment}
                  onChange={(event) =>
                    setEditFormState((prev) => ({
                      ...prev,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Write your updated review comment"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Tags (optional)</p>
                <Input
                  value={editFormState.tags}
                  onChange={(event) =>
                    setEditFormState((prev) => ({
                      ...prev,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="spicy, service, ambiance"
                />
                <p className="text-xs text-muted-foreground">Use comma-separated tags.</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedReviewForEdit(null)}
                disabled={isUpdatingReview}
              >
                Cancel
              </Button>
              <Button onClick={() => void handleSaveEdit()} disabled={isUpdatingReview}>
                {isUpdatingReview ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={Boolean(selectedReviewForDelete)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Review</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your review. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedReviewForDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void handleConfirmDelete()}
                disabled={isDeletingReview}
                variant="destructive"
              >
                {isDeletingReview ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
