"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, UploadCloud, X, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import RestaurantLocationPicker from "@/components/modules/restaurant/RestaurantLocationPicker";
import { createUnifiedReviewTransaction, IUnifiedCreatePayload } from "@/services/unified.client";
import { getRestaurants } from "@/services/restaurant.services";
import { getDishes } from "@/services/dish.services";
import { UserRole } from "@/types/enums";

type RestaurantMode = "create" | "select";
type DishMode = "create" | "select";

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

const formFieldClassName = "border-muted-foreground/45 bg-transparent dark:bg-transparent";

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
  const [restaurantSearchInput, setRestaurantSearchInput] = useState("");
  const [dishSearchInput, setDishSearchInput] = useState("");
  const [debouncedRestaurantSearch, setDebouncedRestaurantSearch] = useState("");
  const [debouncedDishSearch, setDebouncedDishSearch] = useState("");
  const [restaurantMode, setRestaurantMode] = useState<RestaurantMode>("create");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [dishMode, setDishMode] = useState<DishMode>("create");
  const [selectedDishId, setSelectedDishId] = useState<string>("");
  const [restaurantImages, setRestaurantImages] = useState<File[]>([]);
  const [dishImages, setDishImages] = useState<File[]>([]);
  const [reviewImages, setReviewImages] = useState<File[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedRestaurantSearch(restaurantSearchInput.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [restaurantSearchInput]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedDishSearch(dishSearchInput.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dishSearchInput]);

  // Fetch restaurants
  const { data: restaurantsResponse, isLoading: restaurantsLoading } = useQuery({
    queryKey: ["restaurants-for-review", debouncedRestaurantSearch],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");

      if (debouncedRestaurantSearch) {
        params.set("searchTerm", debouncedRestaurantSearch);
      }

      return getRestaurants(params.toString());
    },
    enabled: open && restaurantMode === "select",
  });

  const restaurants = restaurantsResponse?.data || [];

  // Fetch dishes
  const { data: dishesResponse, isLoading: dishesLoading } = useQuery({
    queryKey: ["dishes-for-review", debouncedDishSearch, restaurantMode, selectedRestaurantId],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");

      if (debouncedDishSearch) {
        params.set("searchTerm", debouncedDishSearch);
      }

      if (restaurantMode === "select" && selectedRestaurantId) {
        params.set("restaurantId", selectedRestaurantId);
      }

      return getDishes(params.toString());
    },
    enabled: open && dishMode === "select",
  });

  const dishes = dishesResponse?.data || [];

  const filteredDishes = useMemo(() => {
    if (restaurantMode !== "select" || !selectedRestaurantId) {
      return dishes;
    }

    return dishes.filter((dish) => {
      const dishRestaurantId = dish.restaurantId || dish.restaurant?.id;
      return dishRestaurantId === selectedRestaurantId;
    });
  }, [dishes, restaurantMode, selectedRestaurantId]);

  useEffect(() => {
    if (!selectedDishId) {
      return;
    }

    const stillValid = filteredDishes.some((dish) => dish.id === selectedDishId);
    if (!stillValid) {
      setSelectedDishId("");
    }
  }, [filteredDishes, selectedDishId]);

  useEffect(() => {
    if (restaurantMode !== "create") {
      return;
    }

    if (dishMode !== "create") {
      setDishMode("create");
    }

    if (selectedDishId) {
      setSelectedDishId("");
    }
  }, [restaurantMode, dishMode, selectedDishId]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const rating = Number(formState.reviewRating);

      if (restaurantMode === "create" && dishMode === "select") {
        throw new Error(
          "Existing dish can only be selected with an existing restaurant. Select a restaurant or create a new dish.",
        );
      }

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error("Rating must be an integer between 1 and 5");
      }

      // Validate restaurant
      let restaurantPayload: { restaurantId?: string; restaurant?: any } = {};
      if (restaurantMode === "select") {
        if (!selectedRestaurantId) {
          throw new Error("Please select a restaurant");
        }
        restaurantPayload.restaurantId = selectedRestaurantId;
      } else {
        const restaurantName = formState.restaurantName.trim();
        const restaurantAddress = formState.restaurantAddress.trim();
        const restaurantCity = formState.restaurantCity.trim();
        const restaurantState = formState.restaurantState.trim();
        const restaurantRoad = formState.restaurantRoad.trim();
        const restaurantLat = formState.restaurantLat.trim();
        const restaurantLng = formState.restaurantLng.trim();

        if (!restaurantName) throw new Error("Restaurant name is required");
        if (!restaurantAddress) throw new Error("Restaurant address is required");
        if (!restaurantCity) throw new Error("Restaurant city is required");
        if (!restaurantState) throw new Error("Restaurant state is required");
        if (!restaurantRoad) throw new Error("Restaurant road is required");
        if (!restaurantLat || !restaurantLng) {
          throw new Error("Restaurant latitude and longitude are required");
        }

        restaurantPayload.restaurant = {
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
        };
      }

      // Validate dish
      let dishPayload: { dishId?: string; dish?: any } = {};
      if (dishMode === "select") {
        if (!selectedDishId) {
          throw new Error("Please select a dish");
        }

        if (restaurantMode === "select") {
          const selectedDish = filteredDishes.find((dish) => dish.id === selectedDishId);
          if (!selectedDish) {
            throw new Error("Selected dish does not belong to the selected restaurant");
          }
        }

        dishPayload.dishId = selectedDishId;
      } else {
        const dishName = formState.dishName.trim();
        const dishIngredientsInput = formState.dishIngredientsInput.trim();
        const dishPrice = formState.dishPrice.trim() ? Number(formState.dishPrice) : undefined;

        if (!dishName) throw new Error("Dish name is required");

        const dishIngredients = parseCommaSeparated(dishIngredientsInput);
        if (dishIngredients.length === 0) throw new Error("At least one dish ingredient is required");

        if (typeof dishPrice === "number" && (!Number.isFinite(dishPrice) || dishPrice <= 0)) {
          throw new Error("Dish price must be greater than 0");
        }

        dishPayload.dish = {
          data: {
            name: dishName,
            description: formState.dishDescription.trim() || undefined,
            price: dishPrice,
            ingredients: dishIngredients,
            tags: parseCommaSeparated(formState.dishTagsInput),
          },
        };
      }

      const payload: IUnifiedCreatePayload = {
        ...restaurantPayload,
        ...dishPayload,
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
      toast.success("Review created successfully");
      setOpen(false);
      setFormState(initialFormState);
      setRestaurantImages([]);
      setDishImages([]);
      setReviewImages([]);
      setSelectedRestaurantId("");
      setSelectedDishId("");
      setRestaurantMode("create");
      setDishMode("create");
      setRestaurantSearchInput("");
      setDishSearchInput("");
      router.refresh();
    },
    onError: (error) => {
      const maybeError = error as { message?: string };
      toast.error(maybeError.message || "Failed to create review");
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
          <DialogTitle>Create Review</DialogTitle>
          <DialogDescription>
            Create a review for a restaurant and dish. Choose to create new or select existing ones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* RESTAURANT SECTION */}
          <SectionFrame title="1) Restaurant" description="Create new or select existing restaurant">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Mode</Label>
                <Select value={restaurantMode} onValueChange={(value) => setRestaurantMode(value as RestaurantMode)}>
                  <SelectTrigger className={`w-full ${formFieldClassName}`}>
                    <SelectValue placeholder="Choose mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create New Restaurant</SelectItem>
                    <SelectItem value="select">Select Existing Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {restaurantMode === "select" ? (
                <div className="space-y-1.5">
                  <Label>Select Restaurant *</Label>
                  <Input
                    className={formFieldClassName}
                    value={restaurantSearchInput}
                    onChange={(event) => setRestaurantSearchInput(event.target.value)}
                    placeholder="Search restaurants by name, city, or tag"
                  />
                  <p className="text-xs text-muted-foreground">
                    Search runs automatically while typing.
                  </p>
                  {restaurantsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : restaurants.length === 0 ? (
                    <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/10 px-3 py-2 text-xs text-muted-foreground">
                      No restaurants available
                    </div>
                  ) : (
                    <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
                      <SelectTrigger className={`w-full ${formFieldClassName}`}>
                        <SelectValue placeholder="Choose a restaurant" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            {restaurant.name} ({restaurant.city})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Restaurant Name *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantName}
                        onChange={(event) => setFormState((prev) => ({ ...prev, restaurantName: event.target.value }))}
                        placeholder="Food Hub"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Contact</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantContact}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantContact: event.target.value }))
                        }
                        placeholder="01800000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea
                      className={formFieldClassName}
                      rows={3}
                      value={formState.restaurantDescription}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, restaurantDescription: event.target.value }))
                      }
                      placeholder="Family restaurant"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Address *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantAddress}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantAddress: event.target.value }))
                        }
                        placeholder="Road 12, House 3"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Road *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantRoad}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantRoad: event.target.value }))
                        }
                        placeholder="Dhanmondi 12"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>City *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantCity}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantCity: event.target.value }))
                        }
                        placeholder="Dhaka"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label>State *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantState}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantState: event.target.value }))
                        }
                        placeholder="Dhaka"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Latitude *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantLat}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantLat: event.target.value }))
                        }
                        placeholder="23.746"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Longitude *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.restaurantLng}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, restaurantLng: event.target.value }))
                        }
                        placeholder="90.376"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Pick Location From Map</Label>
                    <RestaurantLocationPicker
                      lat={formState.restaurantLat}
                      lng={formState.restaurantLng}
                      disabled={isPending}
                      onCoordinatesChange={({ lat, lng, formattedAddress, city, state, road }) => {
                        setFormState((prev) => ({
                          ...prev,
                          restaurantLat: lat,
                          restaurantLng: lng,
                          restaurantAddress: formattedAddress || prev.restaurantAddress,
                          restaurantCity: city || prev.restaurantCity,
                          restaurantState: state || prev.restaurantState,
                          restaurantRoad: road || prev.restaurantRoad,
                        }));
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Search or click on the map to auto-fill coordinates and nearby address details.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      className={formFieldClassName}
                      value={formState.restaurantTagsInput}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, restaurantTagsInput: event.target.value }))
                      }
                      placeholder="family, bbq"
                    />
                  </div>

                  <ImageDropzone
                    title="Restaurant Images"
                    files={restaurantImages}
                    onChange={setRestaurantImages}
                    maxFiles={10}
                  />
                </>
              )}
            </div>
          </SectionFrame>

          {/* DISH SECTION */}
          <SectionFrame title="2) Dish" description="Create new or select existing dish">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Mode</Label>
                <Select value={dishMode} onValueChange={(value) => setDishMode(value as DishMode)}>
                  <SelectTrigger className={`w-full ${formFieldClassName}`}>
                    <SelectValue placeholder="Choose mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="create">Create New Dish</SelectItem>
                    <SelectItem value="select" disabled={restaurantMode === "create"}>
                      Select Existing Dish {restaurantMode === "create" ? "(select restaurant first)" : ""}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dishMode === "select" ? (
                <div className="space-y-1.5">
                  <Label>Select Dish *</Label>
                  <Input
                    className={formFieldClassName}
                    value={dishSearchInput}
                    onChange={(event) => setDishSearchInput(event.target.value)}
                    placeholder="Search dishes by name, tag, or ingredient"
                  />
                  <p className="text-xs text-muted-foreground">
                    Search runs automatically while typing.
                  </p>
                  {restaurantMode === "create" ? (
                    <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/10 px-3 py-2 text-xs text-muted-foreground">
                      Existing dish requires an existing restaurant. Select a restaurant first, or switch dish mode to create.
                    </div>
                  ) : null}
                  {dishesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredDishes.length === 0 ? (
                    <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/10 px-3 py-2 text-xs text-muted-foreground">
                      {restaurantMode === "select"
                        ? "No dishes found for the selected restaurant"
                        : "No dishes available"}
                    </div>
                  ) : (
                    <Select value={selectedDishId} onValueChange={setSelectedDishId}>
                      <SelectTrigger className={`w-full ${formFieldClassName}`}>
                        <SelectValue placeholder="Choose a dish" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDishes.map((dish) => (
                          <SelectItem key={dish.id} value={dish.id}>
                            {dish.name} ({dish.restaurant?.name || "Unknown Restaurant"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Dish Name *</Label>
                      <Input
                        className={formFieldClassName}
                        value={formState.dishName}
                        onChange={(event) => setFormState((prev) => ({ ...prev, dishName: event.target.value }))}
                        placeholder="Chicken Burger"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Price</Label>
                      <Input
                        className={formFieldClassName}
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
                      className={formFieldClassName}
                      rows={3}
                      value={formState.dishDescription}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, dishDescription: event.target.value }))
                      }
                      placeholder="Spicy grilled burger"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Ingredients * (comma separated)</Label>
                    <Input
                      className={formFieldClassName}
                      value={formState.dishIngredientsInput}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, dishIngredientsInput: event.target.value }))
                      }
                      placeholder="chicken, bun, lettuce"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      className={formFieldClassName}
                      value={formState.dishTagsInput}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, dishTagsInput: event.target.value }))
                      }
                      placeholder="spicy, popular"
                    />
                  </div>

                  <ImageDropzone
                    title="Dish Images"
                    files={dishImages}
                    onChange={setDishImages}
                    maxFiles={5}
                  />
                </>
              )}
            </div>
          </SectionFrame>

          {/* REVIEW SECTION */}
          <SectionFrame title="3) Review" description="Add rating, comment, tags, and review images">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Rating *</Label>
                <Select
                  value={formState.reviewRating}
                  onValueChange={(value) => setFormState((prev) => ({ ...prev, reviewRating: value }))}
                >
                  <SelectTrigger className={`w-full ${formFieldClassName}`}>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input
                  className={formFieldClassName}
                  value={formState.reviewTagsInput}
                  onChange={(event) => setFormState((prev) => ({ ...prev, reviewTagsInput: event.target.value }))}
                  placeholder="must-try, delicious"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Comment</Label>
              <Textarea
                className={formFieldClassName}
                rows={4}
                value={formState.reviewComment}
                onChange={(event) => setFormState((prev) => ({ ...prev, reviewComment: event.target.value }))}
                placeholder="Excellent combo, highly recommended!"
              />
            </div>

            <ImageDropzone
              title="Review Images"
              files={reviewImages}
              onChange={setReviewImages}
              maxFiles={5}
            />
          </SectionFrame>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="button" disabled={isPending} onClick={() => void mutateAsync()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Review"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
