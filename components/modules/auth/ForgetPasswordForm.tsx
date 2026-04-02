"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { forgetPassword, resetPassword } from "@/services/auth.client";
import { forgetPasswordZodSchema, resetPasswordZodSchema } from "@/zod/auth.schema";

type Step = "requestOtp" | "resetPassword";

export default function ForgetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("requestOtp");

  const initialEmail = searchParams.get("email") || "";

  const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData && typeof responseData === "object") {
        const apiMessage = (responseData as { message?: unknown }).message;
        const apiError = (responseData as { error?: unknown }).error;

        return String(apiMessage || apiError || fallback);
      }
    }

    return error instanceof Error ? error.message : fallback;
  };

  const requestOtpMutation = useMutation({
    mutationFn: async (payload: { email: string }) => forgetPassword(payload),
    onSuccess: () => {
      setFormError(null);
      setStep("resetPassword");
      toast.success("OTP sent to your email. Enter it below to reset password.");
    },
    onError: (error) => {
      setFormError(getApiErrorMessage(error, "Failed to send OTP"));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string; newPassword: string }) => resetPassword(payload),
    onSuccess: () => {
      setFormError(null);
      toast.success("Password reset successful. Please sign in with your new password.");
      router.push("/login");
    },
    onError: (error) => {
      setFormError(getApiErrorMessage(error, "Failed to reset password"));
    },
  });

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (step === "requestOtp") {
        const parsed = forgetPasswordZodSchema.safeParse({ email: value.email });

        if (!parsed.success) {
          setFormError(null);
          toast.error(parsed.error.issues[0]?.message || "Invalid email");
          return;
        }

        setFormError(null);
        await requestOtpMutation.mutateAsync(parsed.data);
        return;
      }

      const parsed = resetPasswordZodSchema.safeParse(value);

      if (!parsed.success) {
        setFormError(null);
        toast.error(parsed.error.issues[0]?.message || "Invalid reset password input");
        return;
      }

      setFormError(null);
      await resetPasswordMutation.mutateAsync({
        email: parsed.data.email,
        otp: parsed.data.otp,
        newPassword: parsed.data.newPassword,
      });
    },
  });

  const isPending = requestOtpMutation.isPending || resetPasswordMutation.isPending;

  return (
    <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card/80 p-6 shadow-[0_0_50px_rgba(255,87,34,0.08)] backdrop-blur md:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FFD700]">RESET PASSWORD</p>
        <h1 className="text-3xl font-extrabold text-white">Forgot your password?</h1>
        <p className="text-sm text-[#a0a0a0]">
          {step === "requestOtp"
            ? "Enter your account email. We will send an OTP to reset your password."
            : "Enter the OTP from your email and choose a new password."}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = forgetPasswordZodSchema.shape.email.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <AppField
              field={field}
              label="Email"
              type="email"
              placeholder="you@example.com"
              prepend={<Mail className="h-4 w-4 text-[#a0a0a0]" />}
              disabled={isPending || step === "resetPassword"}
            />
          )}
        </form.Field>

        {step === "resetPassword" ? (
          <>
            <form.Field
              name="otp"
              validators={{
                onChange: ({ value }) => {
                  const result = resetPasswordZodSchema.shape.otp.safeParse(value);
                  return result.success ? undefined : result.error.issues[0]?.message;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="OTP"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  prepend={<KeyRound className="h-4 w-4 text-[#a0a0a0]" />}
                  disabled={isPending}
                />
              )}
            </form.Field>

            <form.Field
              name="newPassword"
              validators={{
                onChange: ({ value }) => {
                  const result = resetPasswordZodSchema.shape.newPassword.safeParse(value);
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
                  disabled={isPending}
                />
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value }) => {
                  const result = resetPasswordZodSchema.shape.confirmPassword.safeParse(value);
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
                  disabled={isPending}
                />
              )}
            </form.Field>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                className="h-auto p-0 text-xs text-[#FFD700] hover:bg-transparent hover:text-[#FF5722]"
                disabled={isPending}
                onClick={() => {
                  setFormError(null);
                  setStep("requestOtp");
                }}
              >
                Change email
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-auto p-0 text-xs text-[#FFD700] hover:bg-transparent hover:text-[#FF5722]"
                disabled={isPending}
                onClick={async () => {
                  const currentEmail = form.state.values.email;
                  const emailValidation = forgetPasswordZodSchema.safeParse({ email: currentEmail });

                  if (!emailValidation.success) {
                    setFormError(emailValidation.error.issues[0]?.message || "Please provide a valid email");
                    return;
                  }

                  setFormError(null);
                  await requestOtpMutation.mutateAsync({ email: currentEmail });
                }}
              >
                {requestOtpMutation.isPending ? "Resending..." : "Resend OTP"}
              </Button>
            </div>
          </>
        ) : null}

        {formError ? (
          <div
            role="alert"
            className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]"
          >
            {formError}
          </div>
        ) : null}

        <AppSubmitButton
          isPending={isPending}
          pendingLabel={step === "requestOtp" ? "Sending OTP..." : "Resetting Password..."}
          className="btn-neon-primary mt-1"
        >
          {step === "requestOtp" ? "Send OTP" : "Reset Password"}
        </AppSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[#a0a0a0]">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-[#FFD700] transition-colors hover:text-[#FF5722]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
