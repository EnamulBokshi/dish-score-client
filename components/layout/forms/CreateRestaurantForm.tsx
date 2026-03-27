"use client";

import { useEffect, useMemo, useState } from "react";

import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ICreateRestaurantPayload,
  IRestaurant,
  IUpdateRestaurantPayload,
} from "@/types/restaurant.types";

interface CreateRestaurantFormProps {
  isPending: boolean;
  initialRestaurant?: IRestaurant | null;
  onSubmit: (
    payload: ICreateRestaurantPayload | IUpdateRestaurantPayload,
    images: File[],
  ) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  road: string;
  lat: string;
  lng: string;
  contact: string;
  images: File[];
}

function getInitialState(initialRestaurant?: IRestaurant | null): FormState {
  return {
    name: initialRestaurant?.name ?? "",
    description: initialRestaurant?.description ?? "",
    address: initialRestaurant?.address ?? "",
    city: initialRestaurant?.city ?? "",
    state: initialRestaurant?.state ?? "",
    road: initialRestaurant?.road ?? "",
    lat: initialRestaurant?.location?.lat ?? "",
    lng: initialRestaurant?.location?.lng ?? "",
    contact: initialRestaurant?.contact ?? "",
    images: [],
  };
}

export default function CreateRestaurantForm({
  isPending,
  initialRestaurant,
  onSubmit,
}: CreateRestaurantFormProps) {
  const [formState, setFormState] = useState<FormState>(getInitialState(initialRestaurant));
  const [formError, setFormError] = useState<string | null>(null);

  const selectedImagePreviews = useMemo(
    () => formState.images.map((imageFile) => URL.createObjectURL(imageFile)),
    [formState.images],
  );

  useEffect(() => {
    return () => {
      for (const previewUrl of selectedImagePreviews) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedImagePreviews]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.name.trim()) {
      setFormError("Restaurant name is required");
      return;
    }
    if (!formState.address.trim()) {
      setFormError("Address is required");
      return;
    }
    if (!formState.city.trim()) {
      setFormError("City is required");
      return;
    }
    if (!formState.state.trim()) {
      setFormError("State is required");
      return;
    }
    if (!formState.road.trim()) {
      setFormError("Road is required");
      return;
    }
    if (!formState.lat.trim() || !formState.lng.trim()) {
      setFormError("Both latitude and longitude are required");
      return;
    }

    setFormError(null);

    const payload: ICreateRestaurantPayload | IUpdateRestaurantPayload = {
      name: formState.name.trim(),
      description: formState.description.trim() || undefined,
      address: formState.address.trim(),
      city: formState.city.trim(),
      state: formState.state.trim(),
      road: formState.road.trim(),
      location: {
        lat: formState.lat.trim(),
        lng: formState.lng.trim(),
      },
      contact: formState.contact.trim() || undefined,
    };

    await onSubmit(payload, formState.images);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="restaurant-name">Name</Label>
          <Input
            id="restaurant-name"
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                name: event.target.value,
              }))
            }
            placeholder="Restaurant name"
            disabled={isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="restaurant-contact">Contact (optional)</Label>
          <Input
            id="restaurant-contact"
            value={formState.contact}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                contact: event.target.value,
              }))
            }
            placeholder="Phone or contact details"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="restaurant-description">Description</Label>
        <Textarea
          id="restaurant-description"
          value={formState.description}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          rows={3}
          placeholder="Describe your restaurant"
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="restaurant-address">Address</Label>
        <Input
          id="restaurant-address"
          value={formState.address}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              address: event.target.value,
            }))
          }
          placeholder="Road 12, House 3"
          disabled={isPending}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="restaurant-city">City</Label>
          <Input
            id="restaurant-city"
            value={formState.city}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                city: event.target.value,
              }))
            }
            placeholder="Dhaka"
            disabled={isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="restaurant-state">State</Label>
          <Input
            id="restaurant-state"
            value={formState.state}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                state: event.target.value,
              }))
            }
            placeholder="Dhaka"
            disabled={isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="restaurant-road">Road</Label>
          <Input
            id="restaurant-road"
            value={formState.road}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                road: event.target.value,
              }))
            }
            placeholder="Dhanmondi 12"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="restaurant-lat">Latitude</Label>
          <Input
            id="restaurant-lat"
            value={formState.lat}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                lat: event.target.value,
              }))
            }
            placeholder="23.746"
            disabled={isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="restaurant-lng">Longitude</Label>
          <Input
            id="restaurant-lng"
            value={formState.lng}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                lng: event.target.value,
              }))
            }
            placeholder="90.376"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="restaurant-images">Images (optional)</Label>
        <Input
          id="restaurant-images"
          type="file"
          accept="image/*"
          multiple
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

        {initialRestaurant?.images?.length ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Current images</p>
            <div className="flex flex-wrap gap-2">
              {initialRestaurant.images.map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`Restaurant image ${index + 1}`}
                  className="h-16 w-16 rounded-md border border-dark-border object-cover"
                />
              ))}
            </div>
          </div>
        ) : null}

        {selectedImagePreviews.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">New uploads preview</p>
            <div className="flex flex-wrap gap-2">
              {selectedImagePreviews.map((previewUrl, index) => (
                <img
                  key={`${previewUrl}-${index}`}
                  src={previewUrl}
                  alt={`Selected upload ${index + 1}`}
                  className="h-16 w-16 rounded-md border border-dark-border object-cover"
                />
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
        pendingLabel={initialRestaurant ? "Saving..." : "Creating..."}
        className="btn-neon-primary"
      >
        {initialRestaurant ? "Save Changes" : "Create Restaurant"}
      </AppSubmitButton>
    </form>
  );
}
