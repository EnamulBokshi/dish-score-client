"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  CalendarClock,
  Heart,
  Mail,
  MessageSquareText,
  Star,
  Store,
  Tags,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/common/ErrorState";
import UserDetailsDialog from "@/components/modules/user/UserDetailsDialog";
import DataTable from "@/components/layout/data-show/DataTable";
import DataTableFilterPopover from "@/components/layout/data-table/DataTableFilterPopOver";
import useUrlDataTableControls from "@/components/layout/data-table/UseUrlDataTableControls";
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
import { Textarea } from "@/components/ui/textarea";
import {
  deleteReviewByAdmin,
  getReviews,
  updateReviewByAdmin,
} from "@/services/review.services";
import { getUserById } from "@/services/user.services";
import { IReview } from "@/types/review.types";
import { IUserDetails } from "@/types/user.types";

interface QueryParamsObject {
  [key: string]: string | string[] | undefined;
}

interface AdminReviewManagementTableProps {
  queryString: string;
  queryParamsObject: QueryParamsObject;
}

interface ReviewFilterDraft {
  rating: string;
  restaurantId: string;
  dishId: string;
  userId: string;
  createdAt: string;
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

function getInitials(name?: string) {
  if (!name) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

export default function AdminReviewManagementTable({
  queryString,
  queryParamsObject,
}: AdminReviewManagementTableProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftFilters, setDraftFilters] = useState<ReviewFilterDraft>({
    rating: String(getFirst(queryParamsObject.rating) ?? ""),
    restaurantId: String(getFirst(queryParamsObject.restaurantId) ?? ""),
    dishId: String(getFirst(queryParamsObject.dishId) ?? ""),
    userId: String(getFirst(queryParamsObject.userId) ?? ""),
    createdAt: String(getFirst(queryParamsObject.createdAt) ?? ""),
  });

  const [selectedReviewForView, setSelectedReviewForView] = useState<IReview | null>(null);
  const [selectedReviewForEdit, setSelectedReviewForEdit] = useState<IReview | null>(null);
  const [selectedReviewForDelete, setSelectedReviewForDelete] = useState<IReview | null>(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [editFormState, setEditFormState] = useState<EditReviewFormState>({
    rating: "5",
    comment: "",
    tags: "",
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
    queryKey: ["admin-reviews", queryString],
    queryFn: () => getReviews(queryString),
    placeholderData: (previousData) => previousData,
  });

  const { mutateAsync: deleteReviewMutation, isPending: isDeletingReview } = useMutation({
    mutationFn: deleteReviewByAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  const { mutateAsync: updateReviewMutation, isPending: isUpdatingReview } = useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: { rating: number; comment?: string; tags?: string[] };
    }) => updateReviewByAdmin(reviewId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  const {
    data: selectedUserDetails,
    isLoading: isUserDetailsLoading,
    isFetching: isUserDetailsFetching,
    isError: isUserDetailsError,
    error: userDetailsError,
    refetch: refetchUserDetails,
  } = useQuery({
    queryKey: ["admin-review-user-details", selectedUserForProfile?.id],
    queryFn: () => getUserById(String(selectedUserForProfile?.id)),
    enabled: Boolean(selectedUserForProfile?.id),
    staleTime: 60 * 1000,
  });

  const reviews = data?.data ?? [];
  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const activeSortingState = optimisticSorting ?? sortingState;
  const activePaginationState = optimisticPagination ?? paginationState;
  const activeSearchTerm = optimisticSearchTerm ?? searchTermState;
  const showSkeletonState =
    (isLoading || isFetching || isNavigationPending) && reviews.length === 0;

  const activeFilterCount =
    (getFirst(queryParamsObject.rating) ? 1 : 0) +
    (getFirst(queryParamsObject.restaurantId) ? 1 : 0) +
    (getFirst(queryParamsObject.dishId) ? 1 : 0) +
    (getFirst(queryParamsObject.userId) ? 1 : 0) +
    (getFirst(queryParamsObject.createdAt) ? 1 : 0);

  const reviewColumns = useMemo<ColumnDef<IReview>[]>(
    () => [
      {
        id: "user",
        header: "User",
        accessorFn: (row) => row.user?.name ?? "-",
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div className="flex items-center gap-3">
              <Avatar size="default" className="size-9">
                <AvatarImage src={user?.profilePhoto ?? ""} alt={user?.name ?? "User"} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <p className="font-medium">{user?.name ?? "-"}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? "-"}</p>
                {user?.id ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => {
                      setSelectedUserForProfile({ id: user.id, name: user.name });
                    }}
                  >
                    View profile
                  </Button>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        id: "restaurant.name",
        header: "Restaurant",
        accessorFn: (row) => row.restaurant?.name ?? "-",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.restaurant?.name ?? "-"}</span>
        ),
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
            <span className="block max-w-[20rem] truncate text-sm text-muted-foreground">
              {comment || "No comment"}
            </span>
          );
        },
      },
      {
        id: "likeObtained",
        header: "Like Obtained",
        accessorFn: (row) => row.likes?.length ?? 0,
        cell: ({ row }) => <Badge variant="outline">{row.original.likes?.length ?? 0}</Badge>,
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

    if (draftFilters.userId.trim()) {
      params.set("userId", draftFilters.userId.trim());
    } else {
      params.delete("userId");
    }

    if (draftFilters.createdAt.trim()) {
      params.set("createdAt", draftFilters.createdAt.trim());
    } else {
      params.delete("createdAt");
    }

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const handleClearFilters = () => {
    setDraftFilters({ rating: "", restaurantId: "", dishId: "", userId: "", createdAt: "" });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("rating");
    params.delete("restaurantId");
    params.delete("dishId");
    params.delete("userId");
    params.delete("createdAt");
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
          <CardTitle>Review Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorState
            title="Failed to load reviews"
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
        <CardTitle>Review Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable<IReview>
          data={reviews}
          columns={reviewColumns}
          isLoading={showSkeletonState}
          emptyMessage="No reviews found for the current query."
          search={{
            value: activeSearchTerm,
            onSearchChange: handleSearchChange,
            placeholder: "Search by user, dish, restaurant, or comment...",
            debounceMs: 500,
          }}
          filters={
            <DataTableFilterPopover
              activeCount={activeFilterCount}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              title="Filter reviews"
              description="Filter by rating, relation IDs, and creation date."
            >
              <div className="grid gap-3 md:grid-cols-5">
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

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">User ID</p>
                  <Input
                    value={draftFilters.userId}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        userId: event.target.value,
                      }))
                    }
                    placeholder="Filter by user id"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Created At</p>
                  <Input
                    type="date"
                    value={draftFilters.createdAt}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        createdAt: event.target.value,
                      }))
                    }
                  />
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
          <DialogContent className="sm:max-w-2xl border border-dark-border bg-dark-card/95 p-0 text-[#f4f4f5] backdrop-blur-lg">
            <DialogHeader>
              <div className="border-b border-dark-border px-6 pt-6 pb-4">
                <DialogTitle className="text-xl text-white">Review Details</DialogTitle>
                <DialogDescription className="mt-1 text-[#a3a3ad]">
                  Detailed information for the selected review.
                </DialogDescription>
              </div>
            </DialogHeader>

            {selectedReviewForView && (
              <div className="space-y-5 px-6 pb-6 text-sm">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                      <User className="h-3.5 w-3.5" /> User
                    </p>
                    <p className="font-medium text-white">{selectedReviewForView.user?.name || "-"}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[#c9cad5]">
                      <Mail className="h-3 w-3" />
                      {selectedReviewForView.user?.email || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                      <Store className="h-3.5 w-3.5" /> Restaurant
                    </p>
                    <p className="font-medium text-white">{selectedReviewForView.restaurant?.name || "-"}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                      <UtensilsCrossed className="h-3.5 w-3.5" /> Dish
                    </p>
                    <p className="font-medium text-white">{selectedReviewForView.dish?.name || "-"}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                      <Star className="h-3.5 w-3.5" /> Rating
                    </p>
                    <Badge className="bg-neon-orange/90 text-black hover:bg-neon-orange">
                      {selectedReviewForView.rating}/5
                    </Badge>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 md:col-span-2">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                      <Heart className="h-3.5 w-3.5" /> Likes
                    </p>
                    <p className="font-medium text-white">{selectedReviewForView.likes.length}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <MessageSquareText className="h-3.5 w-3.5" /> Comment
                  </p>
                  <p className="leading-relaxed text-[#e7e7ee]">
                    {selectedReviewForView.comment?.trim() || "No comment"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#9fa0aa]">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {formatDateLabel(selectedReviewForView.createdAt)}
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-[#d6d6dd]">
                    <Tags className="h-3.5 w-3.5" />
                    {selectedReviewForView.tags?.length
                      ? selectedReviewForView.tags.join(", ")
                      : "No tags"}
                  </p>
                </div>

                <div className="flex justify-end">
                  <div className="flex items-center gap-2">
                    {selectedReviewForView.user?.id ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/15 bg-white/3 text-white hover:bg-white/10"
                        onClick={() => {
                          setSelectedUserForProfile({
                            id: selectedReviewForView.user.id,
                            name: selectedReviewForView.user.name,
                          });
                        }}
                      >
                        View User
                      </Button>
                    ) : null}

                    <Button
                      asChild
                      variant="outline"
                      className="border-white/15 bg-white/3 text-white hover:bg-white/10"
                    >
                      <Link href={`/reviews/${selectedReviewForView.id}`}>Open Review</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-dark-border bg-dark-card/70 px-6 py-4" showCloseButton />
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
          <DialogContent className="sm:max-w-2xl border border-dark-border bg-dark-card/95 p-0 text-[#f4f4f5] backdrop-blur-lg">
            <DialogHeader>
              <div className="border-b border-dark-border px-6 pt-6 pb-4">
                <DialogTitle className="text-xl text-white">Edit Review</DialogTitle>
                <DialogDescription className="mt-1 text-[#a3a3ad]">
                  Update rating, comment, and tags for this review.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-4 px-6 pb-6">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-[#f2f2f8]">Rating</p>
                <Select
                  value={editFormState.rating}
                  onValueChange={(value) =>
                    setEditFormState((prev) => ({
                      ...prev,
                      rating: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full border-white/15 bg-white/3 text-white" size="sm">
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
                <p className="text-sm font-medium text-[#f2f2f8]">Comment</p>
                <Textarea
                  rows={5}
                  value={editFormState.comment}
                  onChange={(event) =>
                    setEditFormState((prev) => ({
                      ...prev,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Write an updated review comment"
                  className="border-white/15 bg-white/3 text-white placeholder:text-[#9fa0aa]"
                />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium text-[#f2f2f8]">Tags (optional)</p>
                <Input
                  value={editFormState.tags}
                  onChange={(event) =>
                    setEditFormState((prev) => ({
                      ...prev,
                      tags: event.target.value,
                    }))
                  }
                  placeholder="spicy, service, ambiance"
                  className="border-white/15 bg-white/3 text-white placeholder:text-[#9fa0aa]"
                />
                <p className="text-xs text-[#9fa0aa]">Use comma-separated tags.</p>
              </div>
            </div>

            <DialogFooter className="border-t border-dark-border bg-dark-card/70 px-6 py-4">
              <Button
                variant="outline"
                onClick={() => setSelectedReviewForEdit(null)}
                disabled={isUpdatingReview}
                className="border-white/15 bg-white/3 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleSaveEdit()}
                disabled={isUpdatingReview}
                className="btn-neon-primary"
              >
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
                This will permanently delete the selected review. This action cannot be undone.
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

        <UserDetailsDialog
          open={Boolean(selectedUserForProfile)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedUserForProfile(null);
            }
          }}
          user={(selectedUserDetails as IUserDetails | null) ?? null}
          isLoading={isUserDetailsLoading || isUserDetailsFetching}
          isError={isUserDetailsError}
          error={userDetailsError instanceof Error ? userDetailsError : undefined}
          onRetry={() => {
            void refetchUserDetails();
          }}
        />
      </CardContent>
    </Card>
  );
}
