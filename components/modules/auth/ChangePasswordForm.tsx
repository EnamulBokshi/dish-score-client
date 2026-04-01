"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { changePasswordAction } from "@/services/auth.services";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.schema";

type ChangePasswordInput = Omit<IChangePasswordPayload, "confirmPassword">;

export default function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: async (payload: ChangePasswordInput) => {
      return changePasswordAction(payload);
    },
    onSuccess: (result) => {
      if (!result.success) {
        setFormError(result.message || "Failed to change password");
        toast.error(result.message || "Failed to change password");
        return;
      }

      setFormError(null);
      form.reset();
      toast.success(result.message || "Password changed successfully");
    },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = changePasswordZodSchema.safeParse(value);

      if (!parsed.success) {
        setFormError(null);
        toast.error(parsed.error.issues[0]?.message || "Invalid input");
        return;
      }

      setFormError(null);
      const payload: ChangePasswordInput = {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      };
      await changePasswordMutation.mutateAsync(payload);
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
          <form.Field
            name="currentPassword"
            validators={{
              onChange: ({ value }) => {
                const result = changePasswordZodSchema.shape.currentPassword.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Current Password"
                type="password"
                placeholder="Enter your current password"
                prepend={<Lock className="h-4 w-4 text-[#a0a0a0]" />}
                disabled={changePasswordMutation.isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) => {
                const result = changePasswordZodSchema.shape.newPassword.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                prepend={<Lock className="h-4 w-4 text-[#a0a0a0]" />}
                disabled={changePasswordMutation.isPending}
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                const result = changePasswordZodSchema.shape.confirmPassword.safeParse(value);
                return result.success ? undefined : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your new password"
                prepend={<Lock className="h-4 w-4 text-[#a0a0a0]" />}
                disabled={changePasswordMutation.isPending}
              />
            )}
          </form.Field>

          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]"
            >
              {formError}
            </div>
          )}

          <AppSubmitButton
            isPending={changePasswordMutation.isPending}
            pendingLabel="Changing Password..."
            className="btn-neon-primary mt-2"
          >
            Change Password
          </AppSubmitButton>
    </form>
  );
}
