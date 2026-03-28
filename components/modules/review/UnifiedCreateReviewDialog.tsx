"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, UploadCloud, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createUnifiedReviewTransaction, IUnifiedCreatePayload } from "@/services/unified.client";
import { UserRole } from "@/types/enums";

interface UnifiedCreateReviewDialogProps {
  userRole?: UserRole;
}

interface UnifiedFormState {
  restaurantName: string;
  restaurantDescription: string;
  restaurantAddress: string;
  restaurantCity: string;
  restaurantState: string;
  restaurantRoad: string;
  restaurantLat: string;
  restaurantLng: string;
  restaurantContact: string;
  restaurantTagsInput: string;

  dishName: string;
  dishDescription: string;
  dishPrice: string;
  dishIngredientsInput: string;
  dishTagsInput: string;

  reviewRating: string;
  reviewComment: string;
  reviewTagsInput: string;
}

const initialFormState: UnifiedFormState = {
  restaurantName: "",
  restaurantDescription: "",
  restaurantAddress: "",
  restaurantCity: "",
  restaurantState: "",
  restaurantRoad: "",
  restaurantLat: "",
  restaurantLng: "",
  restaurantContact: "",
  restaurantTagsInput: "",

  dishName: "",
  dishDescription: "",
  dishPrice: "",
  dishIngredientsInput: "",
  dishTagsInput: "",

  reviewRating: "5",
  reviewComment: "",
  reviewTagsInput: "",
};

function parseCommaSeparated(input: string): string[] {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveFieldValue(
  stateValue: string,
  selectors: string[],
  scope?: ParentNode | null,
): string {
  const fromState = stateValue.trim();
  if (fromState) {
    return fromState;
  }

  if (typeof window === "undefined") {
    return fromState;
  }

  const searchRoot = scope ?? document;

  for (const selector of selectors) {
    const element = searchRoot.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;
    const value = element?.value?.trim();
    if (value) {
      return value;
    }
  }

  return "";
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function appendFiles(current: File[], incoming: File[], max: number): File[] {
  const uniqueMap = new Map<string, File>();

  for (const file of current) {
    uniqueMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
  }

  for (const file of incoming) {
    if (!isImageFile(file)) {
      continue;
    }
    uniqueMap.set(`${file.name}-${file.size}-${file.lastModified}`, file);
  }

  return Array.from(uniqueMap.values()).slice(0, max);
}

function SectionFrame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="border-dashed border-muted-foreground/40 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function ImageDropzone({
  title,
  files,
  onChange,
  maxFiles,
}: {
  title: string;
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    return () => {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [previewUrls]);

  const handleIncoming = (incoming: File[]) => {
    onChange(appendFiles(files, incoming, maxFiles));
  };

  return (
    <div className="space-y-3">
      <Label>{title}</Label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const dropped = Array.from(event.dataTransfer.files || []);
          handleIncoming(dropped);
        }}
        className={`cursor-pointer rounded-xl border border-dashed p-4 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/40 bg-muted/15 hover:bg-muted/25"
        }`}
      >
        <UploadCloud className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-medium">Drag and drop images here</p>
        <p className="text-xs text-muted-foreground">
          or click to browse (max {maxFiles})
        </p>
      </div>

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          const selected = Array.from(event.target.files || []);
          handleIncoming(selected);
          event.currentTarget.value = "";
        }}
      />

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previewUrls.map((previewUrl, index) => (
            <div
              key={`${previewUrl}-${index}`}
              className="relative h-20 overflow-hidden rounded-md border"
            >
              <img
                src={previewUrl}
                alt={`Upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}
                aria-label={`Remove upload ${index + 1}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UnifiedCreateReviewDialog({ userRole }: UnifiedCreateReviewDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const [formState, setFormState] = useState<UnifiedFormState>(initialFormState);
  const [restaurantImages, setRestaurantImages] = useState<File[]>([]);
  const [dishImages, setDishImages] = useState<File[]>([]);
  const [reviewImages, setReviewImages] = useState<File[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const formScope = dialogContentRef.current;

      const restaurantName = resolveFieldValue(formState.restaurantName, [
        "#unified-restaurant-name",
        "input[name='restaurantName']",
      ], formScope);
      const restaurantAddress = resolveFieldValue(formState.restaurantAddress, [
        "#unified-restaurant-address",
        "input[name='restaurantAddress']",
      ], formScope);
      const restaurantCity = resolveFieldValue(formState.restaurantCity, [
        "#unified-restaurant-city",
        "input[name='restaurantCity']",
      ], formScope);
      const restaurantState = resolveFieldValue(formState.restaurantState, [
        "#unified-restaurant-state",
        "input[name='restaurantState']",
      ], formScope);
      const restaurantRoad = resolveFieldValue(formState.restaurantRoad, [
        "#unified-restaurant-road",
        "input[name='restaurantRoad']",
      ], formScope);
      const restaurantLat = resolveFieldValue(formState.restaurantLat, [
        "#unified-restaurant-lat",
        "input[name='restaurantLat']",
      ], formScope);
      const restaurantLng = resolveFieldValue(formState.restaurantLng, [
        "#unified-restaurant-lng",
        "input[name='restaurantLng']",
      ], formScope);
      const dishName = resolveFieldValue(formState.dishName, [
        "#unified-dish-name",
        "input[name='dishName']",
      ], formScope);

      const rating = Number(formState.reviewRating);
      const price = formState.dishPrice.trim() ? Number(formState.dishPrice) : undefined;

      if (!restaurantName) throw new Error("Restaurant name is required");
      if (!restaurantAddress) throw new Error("Restaurant address is required");
      if (!restaurantCity) throw new Error("Restaurant city is required");
      if (!restaurantState) throw new Error("Restaurant state is required");
      if (!restaurantRoad) throw new Error("Restaurant road is required");
      if (!restaurantLat || !restaurantLng) {
        throw new Error("Restaurant latitude and longitude are required");
      }

      if (!dishName) throw new Error("Dish name is required");

      const dishIngredients = parseCommaSeparated(formState.dishIngredientsInput);
      if (dishIngredients.length === 0) throw new Error("At least one dish ingredient is required");

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
      }

      if (typeof price === "number" && (!Number.isFinite(price) || price <= 0)) {
        throw new Error("Dish price must be greater than 0");
      }

      const payload: IUnifiedCreatePayload = {
        restaurant: {
          data: {
            name: restaurantName,
            description: formState.restaurantDescription.trim() || undefined,
            address: restaurantAddress,
            city: restaurantCity,
            state: restaurantState,
            road: restaurantRoad,
            location: {
              lat: restaurantLat,
              lng: restaurantLng,
            },
            contact: formState.restaurantContact.trim() || undefined,
            tags: parseCommaSeparated(formState.restaurantTagsInput),
          },
        },
        dish: {
          data: {
            name: dishName,
            description: formState.dishDescription.trim() || undefined,
            price,
            ingredients: dishIngredients,
            tags: parseCommaSeparated(formState.dishTagsInput),
          },
        },
        review: {
          data: {
            rating,
            comment: formState.reviewComment.trim() || undefined,
            tags: parseCommaSeparated(formState.reviewTagsInput),
          },
        },
      };

      await createUnifiedReviewTransaction({
        payload,
        restaurantImages,
        dishImages,
        reviewImages,
        userRole,
      });
    },
    onSuccess: () => {
      toast.success("Restaurant, dish, and review created successfully");
      setOpen(false);
      setFormState(initialFormState);
      setRestaurantImages([]);
      setDishImages([]);
      setReviewImages([]);
      router.refresh();
    },
    onError: (error) => {
      const maybeError = error as { message?: string };
      toast.error(maybeError.message || "Failed to create unified review");
    },
  });

  if (userRole !== UserRole.CONSUMER) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="fixed right-5 bottom-5 z-40 rounded-full border border-primary/70 bg-primary px-5 font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl sm:right-7 sm:bottom-7"
        >
          <Plus className="h-4 w-4" />
          Create Review
        </Button>
      </DialogTrigger>

      <DialogContent ref={dialogContentRef} className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Unified Review</DialogTitle>
          <DialogDescription>
            Create restaurant, dish, and review in one transaction. If any section fails, nothing is saved.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-dashed border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          This unified flow always creates a new restaurant and a new dish before creating the review.
          If you want to review an existing restaurant or dish, use the regular Create Review flow.
        </div>

        <div className="space-y-4">
          <SectionFrame
            title="1) Create Restaurant"
            description="Provide restaurant information and optional images."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Restaurant Name *</Label>
                <Input
                  id="unified-restaurant-name"
                  name="restaurantName"
                  value={formState.restaurantName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantName: event.target.value }))}
                  placeholder="Food Hub"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Contact</Label>
                <Input
                  value={formState.restaurantContact}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantContact: event.target.value }))}
                  placeholder="01800000000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={formState.restaurantDescription}
                onChange={(event) => setFormState((prev) => ({ ...prev, restaurantDescription: event.target.value }))}
                placeholder="Family restaurant"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Address *</Label>
                <Input
                  id="unified-restaurant-address"
                  name="restaurantAddress"
                  value={formState.restaurantAddress}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantAddress: event.target.value }))}
                  placeholder="Road 12, House 3"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Road *</Label>
                <Input
                  id="unified-restaurant-road"
                  name="restaurantRoad"
                  value={formState.restaurantRoad}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantRoad: event.target.value }))}
                  placeholder="Dhanmondi 12"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label>City *</Label>
                <Input
                  id="unified-restaurant-city"
                  name="restaurantCity"
                  value={formState.restaurantCity}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantCity: event.target.value }))}
                  placeholder="Dhaka"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>State *</Label>
                <Input
                  id="unified-restaurant-state"
                  name="restaurantState"
                  value={formState.restaurantState}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantState: event.target.value }))}
                  placeholder="Dhaka"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Latitude *</Label>
                <Input
                  id="unified-restaurant-lat"
                  name="restaurantLat"
                  value={formState.restaurantLat}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantLat: event.target.value }))}
                  placeholder="23.746"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Longitude *</Label>
                <Input
                  id="unified-restaurant-lng"
                  name="restaurantLng"
                  value={formState.restaurantLng}
                  onChange={(event) => setFormState((prev) => ({ ...prev, restaurantLng: event.target.value }))}
                  placeholder="90.376"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input
                value={formState.restaurantTagsInput}
                onChange={(event) => setFormState((prev) => ({ ...prev, restaurantTagsInput: event.target.value }))}
                placeholder="family, bbq"
              />
            </div>

            <ImageDropzone
              title="Restaurant Images"
              files={restaurantImages}
              onChange={setRestaurantImages}
              maxFiles={10}
            />
          </SectionFrame>

          <SectionFrame
            title="2) Create Dish"
            description="Provide dish details and optional images."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Dish Name *</Label>
                <Input
                  id="unified-dish-name"
                  name="dishName"
                  value={formState.dishName}
                  onChange={(event) => setFormState((prev) => ({ ...prev, dishName: event.target.value }))}
                  placeholder="Chicken Burger"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.dishPrice}
                  onChange={(event) => setFormState((prev) => ({ ...prev, dishPrice: event.target.value }))}
                  placeholder="249"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={formState.dishDescription}
                onChange={(event) => setFormState((prev) => ({ ...prev, dishDescription: event.target.value }))}
                placeholder="Spicy grilled burger"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Ingredients * (comma separated)</Label>
              <Input
                value={formState.dishIngredientsInput}
                onChange={(event) => setFormState((prev) => ({ ...prev, dishIngredientsInput: event.target.value }))}
                placeholder="chicken, bun, lettuce"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Tags (comma separated)</Label>
              <Input
                value={formState.dishTagsInput}
                onChange={(event) => setFormState((prev) => ({ ...prev, dishTagsInput: event.target.value }))}
                placeholder="spicy, popular"
              />
            </div>

            <ImageDropzone
              title="Dish Images"
              files={dishImages}
              onChange={setDishImages}
              maxFiles={5}
            />
          </SectionFrame>

          <SectionFrame
            title="3) Create Review"
            description="Add rating, comment, tags, and review images."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Rating *</Label>
                <Select
                  value={formState.reviewRating}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, reviewRating: value }))}
                >
                  <SelectTrigger className="w-full">
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
                <Label>Tags (comma separated)</Label>
                <Input
                  value={formState.reviewTagsInput}
                  onChange={(event) => setFormState((prev) => ({ ...prev, reviewTagsInput: event.target.value }))}
                  placeholder="must-try"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Comment</Label>
              <Textarea
                rows={4}
                value={formState.reviewComment}
                onChange={(event) => setFormState((prev) => ({ ...prev, reviewComment: event.target.value }))}
                placeholder="Excellent combo"
              />
            </div>

            <ImageDropzone
              title="Review Images"
              files={reviewImages}
              onChange={setReviewImages}
              maxFiles={5}
            />
          </SectionFrame>

          <div className="flex justify-end">
            <Button type="button" className="btn-neon-primary" disabled={isPending} onClick={() => void mutateAsync()}>
              {isPending ? "Creating..." : "Create All"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
