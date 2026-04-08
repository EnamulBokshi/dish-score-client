"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { FORM_FIELD_CLASSNAME } from "@/lib/formFieldStyles";
import { getDishes } from "@/services/dish.services";
import { Button } from "@/components/ui/button";
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
  tags: string[];
  tagInput: string;
  images: File[];
}

const initialFormState: CreateReviewFormState = {
  rating: "5",
  restaurantId: "",
  dishId: "",
  comment: "",
  tags: [],
  tagInput: "",
  images: [],
};

function normalizeToken(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function addUniqueToken(items: string[], nextValue: string): string[] {
  const token = normalizeToken(nextValue);
  if (!token) {
    return items;
  }

  if (items.some((item) => item.toLowerCase() === token.toLowerCase())) {
    return items;
  }

  return [...items, token];
}

function addTokens(items: string[], rawValue: string): string[] {
  const parts = rawValue
    .split(/[\s,]+/)
    .map((item) => normalizeToken(item))
    .filter(Boolean);

  if (parts.length === 0) {
    return items;
  }

  let nextItems = items;
  for (const part of parts) {
    nextItems = addUniqueToken(nextItems, part);
  }

  return nextItems;
}

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
  const selectedImagePreviews = useMemo(
    () => formState.images.map((imageFile) => URL.createObjectURL(imageFile)),
    [formState.images],
  );
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
      tags: formState.tags.length ? formState.tags : undefined,
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
            <SelectTrigger id="review-rating" className={`w-full ${FORM_FIELD_CLASSNAME}`} size="sm">
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
            <SelectTrigger id="review-restaurant-id" className={`w-full ${FORM_FIELD_CLASSNAME}`} size="sm">
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
          <SelectTrigger id="review-dish-id" className={`w-full ${FORM_FIELD_CLASSNAME}`} size="sm">
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
          <div className="flex items-center gap-3 rounded-md border border-border bg-card/80 px-3 py-2 text-foreground dark:border-dark-border dark:bg-dark-card/60">
            {selectedDish.image ? (
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground dark:bg-muted dark:text-muted-foreground">
                N/A
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{selectedDish.name}</p>
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
          className={FORM_FIELD_CLASSNAME}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="font-medium" htmlFor="review-tags">
          Tags (optional)
        </Label>
        <div
          className={`flex min-h-10 flex-wrap items-center gap-2 rounded-md px-3 py-2 ${FORM_FIELD_CLASSNAME}`}
        >
          {formState.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((item) => item !== tag),
                  }))
                }
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Remove ${tag}`}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            id="review-tags"
            value={formState.tagInput}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                tagInput: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " " || event.key === ",") {
                event.preventDefault();
                setFormState((prev) => ({
                  ...prev,
                  tags: addTokens(prev.tags, prev.tagInput),
                  tagInput: "",
                }));
              }

              if (event.key === "Backspace" && !formState.tagInput && formState.tags.length > 0) {
                event.preventDefault();
                setFormState((prev) => ({
                  ...prev,
                  tags: prev.tags.slice(0, -1),
                }));
              }
            }}
            onBlur={() =>
              setFormState((prev) => ({
                ...prev,
                tags: addTokens(prev.tags, prev.tagInput),
                tagInput: "",
              }))
            }
            onPaste={(event) => {
              event.preventDefault();
              const pastedText = event.clipboardData.getData("text");
              setFormState((prev) => ({
                ...prev,
                tags: addTokens(prev.tags, pastedText),
                tagInput: "",
              }));
            }}
            placeholder="Type and press space"
            disabled={isPending}
            className="h-6 min-w-32 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground dark:text-[#f4f7ff] dark:placeholder:text-[#9aa4b5]"
          />
        </div>
        <p className="text-xs text-muted-foreground">Press space, comma, or enter to add a tag.</p>
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
          className={FORM_FIELD_CLASSNAME}
        />
        {formState.images.length > 0 && (
          <p className="text-xs text-muted-foreground">{formState.images.length} image(s) selected</p>
        )}

        {selectedImagePreviews.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">New uploads preview</p>
            <div className="flex flex-wrap gap-2">
              {selectedImagePreviews.map((previewUrl, index) => (
                <div
                  key={`${previewUrl}-${index}`}
                  className="relative h-16 w-16 overflow-hidden rounded-md border border-border dark:border-dark-border"
                >
                  <img
                    src={previewUrl}
                    alt={`Selected upload ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, imageIndex) => imageIndex !== index),
                      }))
                    }
                    className="absolute right-0 top-0 h-5 w-5 rounded-bl-md rounded-tr-md p-0"
                    aria-label={`Remove selected upload ${index + 1}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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
