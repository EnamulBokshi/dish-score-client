"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { getDishes } from "@/services/dish.services";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ICreateReviewPayload } from "@/types/review.types";
import { IRestaurant } from "@/types/restaurant.types";

interface CreateReviewFormProps {
  restaurants: IRestaurant[];
  isPending: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

interface CreateReviewFormState {
  rating: string;
  restaurantId: string;
  dishId: string;
  comment: string;
  images: File[];
}

const initialFormState: CreateReviewFormState = {
  rating: "5",
  restaurantId: "",
  dishId: "",
  comment: "",
  images: [],
};

export default function CreateReviewForm({
  restaurants,
  isPending,
  onSubmit,
}: CreateReviewFormProps) {
  const [formState, setFormState] = useState<CreateReviewFormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === formState.restaurantId),
    [formState.restaurantId, restaurants],
  );

  const { data: dishesResponse, isLoading: isDishesLoading } = useQuery({
    queryKey: ["dishes", "review-select", formState.restaurantId],
    queryFn: () =>
      getDishes(
        `restaurantId=${encodeURIComponent(formState.restaurantId)}&page=1&limit=200&sortBy=createdAt&sortOrder=desc`,
      ),
    enabled: Boolean(formState.restaurantId),
    staleTime: 10 * 60 * 1000,
  });

  const dishes = useMemo(() => dishesResponse?.data ?? [], [dishesResponse]);
  const selectedDish = useMemo(
    () => dishes.find((dish) => dish.id === formState.dishId),
    [dishes, formState.dishId],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedRating = Number(formState.rating);

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      setFormError("Rating must be an integer between 1 and 5");
      return;
    }

    if (!formState.restaurantId.trim()) {
      setFormError("Please select a restaurant");
      return;
    }

    if (!formState.dishId.trim()) {
      setFormError("Please select a dish");
      return;
    }

    if (formState.images.length > 5) {
      setFormError("You can upload up to 5 images");
      return;
    }

    setFormError(null);

    const payload: ICreateReviewPayload = {
      rating: parsedRating,
      restaurantId: formState.restaurantId,
      dishId: formState.dishId.trim(),
      comment: formState.comment.trim() || undefined,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    for (const image of formState.images) {
      formData.append("images", image);
    }

    await onSubmit(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="font-medium" htmlFor="review-rating">
            Rating
          </Label>
          <Select
            value={formState.rating}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                rating: value,
              }))
            }
          >
            <SelectTrigger id="review-rating" className="w-full" size="sm">
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
          <Label className="font-medium" htmlFor="review-restaurant-id">
            Restaurant
          </Label>
          <Select
            value={formState.restaurantId || ""}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                restaurantId: value,
                dishId: "",
              }))
            }
          >
            <SelectTrigger id="review-restaurant-id" className="w-full" size="sm">
              <SelectValue placeholder="Select restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedRestaurant && (
        <p className="text-xs text-muted-foreground">
          Selected: {selectedRestaurant.name} ({selectedRestaurant.city}, {selectedRestaurant.state})
        </p>
      )}

      <div className="space-y-1.5">
        <Label className="font-medium" htmlFor="review-dish-id">
          Dish
        </Label>
        <Select
          value={formState.dishId || ""}
          onValueChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              dishId: value,
            }))
          }
          disabled={isPending || !formState.restaurantId || isDishesLoading}
        >
          <SelectTrigger id="review-dish-id" className="w-full" size="sm">
            <SelectValue
              placeholder={
                !formState.restaurantId
                  ? "Select restaurant first"
                  : isDishesLoading
                    ? "Loading dishes..."
                    : "Select dish"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {dishes.map((dish) => (
              <SelectItem key={dish.id} value={dish.id}>
                {dish.name}
                {typeof dish.price === "number" ? ` - $${dish.price.toFixed(2)}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formState.restaurantId && !isDishesLoading && dishes.length === 0 && (
          <p className="text-xs text-muted-foreground">No dishes found for this restaurant.</p>
        )}
        {selectedDish && (
          <div className="flex items-center gap-3 rounded-md border border-dark-border bg-dark-card/60 px-3 py-2">
            {selectedDish.image ? (
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                N/A
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{selectedDish.name}</p>
              <p className="text-xs text-muted-foreground">
                {typeof selectedDish.price === "number" ? `$${selectedDish.price.toFixed(2)}` : "Price unavailable"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="font-medium" htmlFor="review-comment">
          Comment (optional)
        </Label>
        <Textarea
          id="review-comment"
          rows={4}
          value={formState.comment}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              comment: event.target.value,
            }))
          }
          placeholder="Share your experience"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="font-medium" htmlFor="review-images">
          Images (optional, up to 5)
        </Label>
        <Input
          id="review-images"
          type="file"
          multiple
          accept="image/*"
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              images: Array.from(event.target.files || []),
            }))
          }
          disabled={isPending}
        />
        {formState.images.length > 0 && (
          <p className="text-xs text-muted-foreground">{formState.images.length} image(s) selected</p>
        )}
      </div>

      {formError && (
        <div className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]">
          {formError}
        </div>
      )}

      <AppSubmitButton
        isPending={isPending}
        pendingLabel="Submitting review..."
        className="btn-neon-primary"
      >
        Submit Review
      </AppSubmitButton>
    </form>
  );
}
