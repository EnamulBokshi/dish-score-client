"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { FORM_FIELD_CLASSNAME } from "@/lib/formFieldStyles";
import { Button } from "@/components/ui/button";
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
  tags: string[];
  tagInput: string;
  ingredients: string[];
  ingredientInput: string;
  price: string;
  restaurantId: string;
  image: File | null;
}

function getInitialState(initialDish?: IDish | null): FormState {
  return {
    name: initialDish?.name ?? "",
    description: initialDish?.description ?? "",
    tags: initialDish?.tags ?? [],
    tagInput: "",
    ingredients: initialDish?.ingredients ?? [],
    ingredientInput: "",
    price: initialDish?.price ? String(initialDish.price) : "",
    restaurantId: initialDish?.restaurantId ?? "",
    image: null,
  };
}

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
  const [isCurrentImageRemoved, setIsCurrentImageRemoved] = useState(false);
  const currentImages =
    initialDish?.image && !isCurrentImageRemoved ? [initialDish.image] : [];

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

    const ingredients = formState.ingredients;
    if (!initialDish && ingredients.length === 0) {
      setFormError("At least one ingredient is required");
      return;
    }

    setFormError(null);

    const payload: ICreateDishPayload | IUpdateDishPayload = initialDish
      ? {
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
          tags: formState.tags.length ? formState.tags : undefined,
          ingredients: ingredients.length ? ingredients : undefined,
          price: priceNum,
          ...(isCurrentImageRemoved ? { removeImage: true, image: null } : {}),
        }
      : {
          name: formState.name.trim(),
          description: formState.description.trim() || undefined,
          tags: formState.tags.length ? formState.tags : undefined,
          ingredients,
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
            className={FORM_FIELD_CLASSNAME}
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
            className={FORM_FIELD_CLASSNAME}
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
            <SelectTrigger id="dish-restaurant" className={FORM_FIELD_CLASSNAME}>
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
          className={FORM_FIELD_CLASSNAME}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dish-tags">Tags (optional)</Label>
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
            id="dish-tags"
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
        <Label htmlFor="dish-ingredients">Ingredients {initialDish ? "(optional)" : "*"}</Label>
        <div
          className={`flex min-h-10 flex-wrap items-center gap-2 rounded-md px-3 py-2 ${FORM_FIELD_CLASSNAME}`}
        >
          {formState.ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-xs"
            >
              {ingredient}
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    ingredients: prev.ingredients.filter((item) => item !== ingredient),
                  }))
                }
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Remove ${ingredient}`}
                disabled={isPending}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            id="dish-ingredients"
            value={formState.ingredientInput}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                ingredientInput: event.target.value,
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " " || event.key === ",") {
                event.preventDefault();
                setFormState((prev) => ({
                  ...prev,
                  ingredients: addTokens(prev.ingredients, prev.ingredientInput),
                  ingredientInput: "",
                }));
              }

              if (event.key === "Backspace" && !formState.ingredientInput && formState.ingredients.length > 0) {
                event.preventDefault();
                setFormState((prev) => ({
                  ...prev,
                  ingredients: prev.ingredients.slice(0, -1),
                }));
              }
            }}
            onBlur={() =>
              setFormState((prev) => ({
                ...prev,
                ingredients: addTokens(prev.ingredients, prev.ingredientInput),
                ingredientInput: "",
              }))
            }
            onPaste={(event) => {
              event.preventDefault();
              const pastedText = event.clipboardData.getData("text");
              setFormState((prev) => ({
                ...prev,
                ingredients: addTokens(prev.ingredients, pastedText),
                ingredientInput: "",
              }));
            }}
            placeholder="Type and press space"
            disabled={isPending}
            className="h-6 min-w-32 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground dark:text-[#f4f7ff] dark:placeholder:text-[#9aa4b5]"
          />
        </div>
        <p className="text-xs text-muted-foreground">Press space, comma, or enter to add an ingredient.</p>
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
          className={FORM_FIELD_CLASSNAME}
        />
      </div>

      {(currentImages.length > 0 || selectedImagePreview) && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Image Preview</Label>
          <div className="flex flex-wrap gap-2">
            {currentImages.map((src, idx) => (
              <div
                key={`current-${idx}`}
                className="relative h-20 w-20 overflow-hidden rounded-md border border-border dark:border-dark-border"
              >
                <Image
                  src={src}
                  alt={`Current ${idx}`}
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
                {initialDish ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      setIsCurrentImageRemoved(true);
                    }}
                    className="absolute right-0 top-0 h-5 w-5 rounded-bl-md rounded-tr-md p-0"
                    aria-label="Remove current image"
                    disabled={isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                ) : null}
              </div>
            ))}
            {selectedImagePreview ? (
              <div
                key="preview"
                className="relative h-20 w-20 overflow-hidden rounded-md border-2 border-primary"
              >
                <Image
                  src={selectedImagePreview}
                  alt="Selected image preview"
                  fill
                  sizes="80px"
                  unoptimized
                  className="object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setFormState((prev) => ({
                      ...prev,
                      image: null,
                    }));
                    setIsCurrentImageRemoved(false);
                  }}
                  className="absolute right-0 top-0 h-5 w-5 rounded-bl-md rounded-tr-md p-0"
                  aria-label="Remove selected image"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null}
          </div>
          {initialDish && isCurrentImageRemoved && !selectedImagePreview ? (
            <p className="text-xs text-amber-300">
              Current image will be removed when you save changes.
            </p>
          ) : null}
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
