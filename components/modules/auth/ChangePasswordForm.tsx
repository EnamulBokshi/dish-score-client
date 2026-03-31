"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword } from "@/services/auth.client";
import { IChangePasswordPayload, changePasswordZodSchema } from "@/zod/auth.schema";

type ChangePasswordInput = Omit<IChangePasswordPayload, "confirmPassword">;

export default function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const changePasswordMutation = useMutation({
    mutationFn: async (payload: ChangePasswordInput) => {
      return changePassword(payload);
    },
    onSuccess: () => {
      setFormError(null);
      form.reset();
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (error instanceof Error ? error.message : "Failed to change password");
      setFormError(String(message));
      toast.error(message);
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
    <Card className="border-border bg-card/85">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent>
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

          <div className="flex gap-3 pt-4">
            <AppSubmitButton
              isPending={changePasswordMutation.isPending}
              pendingLabel="Updating..."
              className="btn-neon-primary flex-1"
            >
              Update Password
            </AppSubmitButton>
            <button
              type="button"
              onClick={() => {
                form.reset();
                setFormError(null);
              }}
              disabled={changePasswordMutation.isPending}
              className="flex-1 rounded-lg border border-border hover:border-foreground/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
