"use client";

import { useEffect, useMemo, useState } from "react";

import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ICreateDishPayload,
  IDish,
  IUpdateDishPayload,
} from "@/types/dish.types";
import { IRestaurant } from "@/types/restaurant.types";

interface CreateDishFormProps {
  isPending: boolean;
  restaurants: IRestaurant[];
  initialDish?: IDish | null;
  onSubmit: (
    payload: ICreateDishPayload | IUpdateDishPayload,
    image: File | undefined,
  ) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  restaurantId: string;
  image: File | null;
}

function getInitialState(initialDish?: IDish | null): FormState {
  return {
    name: initialDish?.name ?? "",
    description: initialDish?.description ?? "",
    price: initialDish?.price ? String(initialDish.price) : "",
    restaurantId: initialDish?.restaurantId ?? "",
    image: null,
  };
}

export default function CreateDishForm({
  isPending,
  restaurants,
  initialDish,
  onSubmit,
}: CreateDishFormProps) {
  const [formState, setFormState] = useState<FormState>(
    getInitialState(initialDish),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const currentImages = initialDish?.image ? [initialDish.image] : [];

  const selectedImagePreview = useMemo(
    () => (formState.image ? URL.createObjectURL(formState.image) : null),
    [formState.image],
  );

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      setFormError("Dish name is required");
      return;
    }
    if (!formState.price.trim()) {
      setFormError("Price is required");
      return;
    }

    const priceNum = parseFloat(formState.price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setFormError("Price must be a valid positive number");
      return;
    }

    if (!initialDish && !formState.restaurantId.trim()) {
      setFormError("Restaurant is required");
      return;
    }

    setFormError(null);

    const payload: ICreateDishPayload | IUpdateDishPayload = initialDish
      ? {
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
          price: priceNum,
        }
      : {
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
          price: priceNum,
          restaurantId: formState.restaurantId.trim(),
        };

    await onSubmit(payload, formState.image ?? undefined);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="dish-name">Name *</Label>
          <Input
            id="dish-name"
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            placeholder="Dish name"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dish-price">Price ($) *</Label>
          <Input
            id="dish-price"
            type="number"
            step="0.01"
            min="0"
            value={formState.price}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                price: event.target.value,
              }))
            }
            placeholder="0.00"
            disabled={isPending}
          />
        </div>
      </div>

      {!initialDish && (
        <div className="space-y-1.5">
          <Label htmlFor="dish-restaurant">Restaurant *</Label>
          <Select
            value={formState.restaurantId}
            onValueChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                restaurantId: value,
              }))
            }
            disabled={isPending}
          >
            <SelectTrigger id="dish-restaurant">
              <SelectValue placeholder="Select a restaurant" />
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
      )}

      <div className="space-y-1.5">
        <Label htmlFor="dish-description">Description (optional)</Label>
        <Textarea
          id="dish-description"
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          placeholder="Describe this dish..."
          disabled={isPending}
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dish-images">Images (optional)</Label>
        <Input
          id="dish-images"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0] || null;
            setFormState((prev) => ({
              ...prev,
              image: file,
            }));
          }}
          disabled={isPending}
        />
      </div>

      {(currentImages.length > 0 || selectedImagePreview) && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Image Preview</Label>
          <div className="flex flex-wrap gap-2">
            {currentImages.map((src, idx) => (
              <div
                key={`current-${idx}`}
                className="relative h-20 w-20 overflow-hidden rounded-md border"
              >
                <img
                  src={src}
                  alt={`Current ${idx}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {selectedImagePreview ? (
              <div
                key="preview"
                className="relative h-20 w-20 overflow-hidden rounded-md border-2 border-primary"
              >
                <img
                  src={selectedImagePreview}
                  alt="Selected image preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {formError && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </div>
      )}

      <AppSubmitButton isPending={isPending}>
        {initialDish ? "Update Dish" : "Create Dish"}
      </AppSubmitButton>
    </form>
  );
}
