"use client";

import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, Info, UserRound } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateMyOwnerProfile, updateMyProfile, updateMyReviewerProfile } from "@/services/profile.client";
import { IMyProfileData } from "@/types/profile.types";
import { UserRole } from "@/types/enums";

type ProfileFormValues = {
  name: string;
  image: string;
  bio: string;
  businessName: string;
  contactNumber: string;
};

function toCleanString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    if (responseData && typeof responseData === "object") {
      const apiMessage = (responseData as { message?: unknown }).message;
      const apiError = (responseData as { error?: unknown }).error;
      return String(apiMessage || apiError || fallback);
    }
  }

  return error instanceof Error ? error.message : fallback;
}

export default function ProfileUpdateForm({ user }: { user: IMyProfileData }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const role = user.role?.toUpperCase?.() || "";
  const isConsumer = role === UserRole.CONSUMER;
  const isOwner = role === UserRole.OWNER;
  const isEditable = isConsumer || isOwner;

  const initialImage = useMemo(() => user.image || user.profilePhoto || "", [user.image, user.profilePhoto]);

  const profileMutation = useMutation({
    mutationFn: async (value: ProfileFormValues) => {
      const cleanName = value.name.trim();

      await updateMyProfile(String(user.id), {
        name: cleanName,
        image: toCleanString(value.image) ?? null,
      });

      if (isConsumer) {
        await updateMyReviewerProfile({
          bio: toCleanString(value.bio),
        });
      }

      if (isOwner) {
        await updateMyOwnerProfile({
          businessName: toCleanString(value.businessName),
          contactNumber: toCleanString(value.contactNumber),
        });
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      router.refresh();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Failed to update profile");
      setFormError(message);
      toast.error(message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: user.name || "",
      image: initialImage,
      bio: user.reviewerProfile?.bio || "",
      businessName: user.ownerProfile?.businessName || "",
      contactNumber: user.ownerProfile?.contactNumber || "",
    } satisfies ProfileFormValues,
    onSubmit: async ({ value }) => {
      if (!isEditable) {
        setFormError("Profile editing is only available for consumers and owners.");
        return;
      }

      const cleanName = value.name.trim();
      if (cleanName.length < 2) {
        setFormError("Name must be at least 2 characters long");
        return;
      }

      setFormError(null);
      await profileMutation.mutateAsync(value);
    },
  });

  const imageValue = form.state.values.image?.trim() || initialImage;
  const fallbackInitial = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="rounded-2xl border border-border bg-card/85 p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
          <p className="text-sm text-muted-foreground">Update your account details and role-specific profile information.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imageValue} alt={user.name} />
            <AvatarFallback>{fallbackInitial}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{role.toLowerCase().replace("_", " ")}</p>
          </div>
        </div>
      </div>

      {!isEditable ? (
        <div className="rounded-lg border border-border bg-background/50 px-4 py-3 text-sm text-muted-foreground">
          Profile editing is currently available only for consumers and owners.
        </div>
      ) : null}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const trimmed = value.trim();
              return trimmed.length >= 2 ? undefined : "Name must be at least 2 characters long";
            },
          }}
        >
          {(field) => (
            <AppField
              field={field}
              label="Name"
              type="text"
              placeholder="Your full name"
              prepend={<UserRound className="h-4 w-4 text-[#a0a0a0]" />}
              disabled={!isEditable || profileMutation.isPending}
            />
          )}
        </form.Field>

        <form.Field
          name="image"
          validators={{
            onChange: ({ value }) => {
              if (!value) return undefined;
              return value.length >= 3 ? undefined : "Image path is too short";
            },
          }}
        >
          {(field) => (
            <AppField
              field={field}
              label="Profile Image"
              type="text"
              placeholder="Paste an image URL or stored image path"
              prepend={<ImageIcon className="h-4 w-4 text-[#a0a0a0]" />}
              disabled={!isEditable || profileMutation.isPending}
            />
          )}
        </form.Field>

        {isConsumer ? (
          <div className="space-y-2">
            <Label htmlFor="bio" className="font-medium">Bio</Label>
            <div className="relative">
              <Info className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#a0a0a0]" />
              <form.Field
                name="bio"
                validators={{
                  onChange: ({ value }) => {
                    return value.length <= 500 ? undefined : "Bio must be at most 500 characters";
                  },
                }}
              >
                {(field) => (
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Tell others about yourself"
                    disabled={!isEditable || profileMutation.isPending}
                    className="min-h-28 resize-y border-input bg-transparent pl-10 text-sm"
                  />
                )}
              </form.Field>
            </div>
          </div>
        ) : null}

        {isOwner ? (
          <div className="grid gap-5 md:grid-cols-2">
            <form.Field
              name="businessName"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) return undefined;
                  return value.trim().length >= 2 ? undefined : "Business name must be at least 2 characters long";
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Business Name"
                  type="text"
                  placeholder="Your business name"
                  disabled={!isEditable || profileMutation.isPending}
                />
              )}
            </form.Field>

            <form.Field
              name="contactNumber"
              validators={{
                onChange: ({ value }) => {
                  if (!value.trim()) return undefined;
                  return value.trim().length >= 6 ? undefined : "Contact number looks too short";
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Contact Number"
                  type="text"
                  placeholder="Your contact number"
                  disabled={!isEditable || profileMutation.isPending}
                />
              )}
            </form.Field>
          </div>
        ) : null}

        {formError ? (
          <div role="alert" className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]">
            {formError}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-border bg-background/50"
            onClick={() => form.reset()}
            disabled={!isEditable || profileMutation.isPending}
          >
            Reset Changes
          </Button>
          <AppSubmitButton
            isPending={profileMutation.isPending}
            pendingLabel="Saving..."
            className="btn-neon-primary h-10"
            disabled={true}
          >
            Save Profile
          </AppSubmitButton>
        </div>
      </form>
    </div>
  );
}
