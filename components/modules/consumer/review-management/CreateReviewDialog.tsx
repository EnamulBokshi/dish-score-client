"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import CreateReviewForm from "@/components/layout/forms/CreateReviewForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createReview } from "@/services/review.services";
import { getRestaurants } from "@/services/restaurant.services";

interface CreateReviewDialogProps {
  queryKey: unknown[];
}

export default function CreateReviewDialog({ queryKey }: CreateReviewDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: restaurantResponse, isLoading: isRestaurantsLoading } = useQuery({
    queryKey: ["restaurants", "review-select"],
    queryFn: () => getRestaurants("page=1&limit=200&sortBy=createdAt&sortOrder=desc"),
    staleTime: 10 * 60 * 1000,
  });

  const restaurants = useMemo(() => restaurantResponse?.data ?? [], [restaurantResponse]);

  const { mutateAsync: createReviewMutation, isPending: isCreatingReview } = useMutation({
    mutationFn: (formData: FormData) => createReview(formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      toast.success("Review created successfully");
      setOpen(false);
    },
    onError: (error) => {
      const maybeError = error as { message?: string };
      toast.error(maybeError.message || "Failed to create review");
    },
  });

  const handleSubmit = async (formData: FormData) => {
    await createReviewMutation(formData);
  };

  return (
    <>
      <Button type="button" size="sm" className="btn-neon-primary h-8" onClick={() => setOpen(true)}>
        Create Review
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Review</DialogTitle>
            <DialogDescription>
              Share your rating and experience. Images will be uploaded as multipart form data.
            </DialogDescription>
          </DialogHeader>

          {isRestaurantsLoading ? (
            <p className="text-sm text-muted-foreground">Loading restaurants...</p>
          ) : restaurants.length === 0 ? (
            <p className="rounded-md border border-dark-border bg-dark-card/60 px-3 py-3 text-sm text-muted-foreground">
              No restaurants available right now.
            </p>
          ) : (
            <CreateReviewForm
              restaurants={restaurants}
              isPending={isCreatingReview}
              onSubmit={handleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
