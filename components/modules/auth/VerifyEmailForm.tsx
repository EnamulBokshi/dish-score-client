"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { resendOtp, verifyEmail } from "@/services/auth.client";
import { verifyEmailZodSchema } from "@/zod/auth.schema";

export default function VerifyEmailForm() {
  const OTP_EXPIRATION_SECONDS = 120;
  const RESEND_COOLDOWN_SECONDS = 60;

  const searchParams = useSearchParams();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_EXPIRATION_SECONDS);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const initialEmail = searchParams.get("email") || "";

  const getApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      if (responseData && typeof responseData === "object" && "error" in responseData) {
        return String((responseData as { error?: unknown }).error || "Verification failed");
      }
    }

    return error instanceof Error ? error.message : "Verification failed";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOtpSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setResendSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const verifyMutation = useMutation({
    mutationFn: async (payload: { otp: string; email: string }) => verifyEmail(payload),
    onSuccess: () => {
      setFormError(null);
      toast.success("Email verified successfully. You can sign in now.");
      router.push("/login");
    },
    onError: (error) => {
      setFormError(getApiErrorMessage(error));
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (payload: { email: string }) => resendOtp(payload),
    onSuccess: () => {
      setFormError(null);
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtpSecondsLeft(OTP_EXPIRATION_SECONDS);
      toast.success("A new OTP has been sent to your email.");
    },
    onError: (error) => {
      setFormError(getApiErrorMessage(error));
    },
  });

  const form = useForm({
    defaultValues: {
      email: initialEmail,
      otp: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = verifyEmailZodSchema.safeParse(value);

      if (!parsed.success) {
        setFormError(null);
        toast.error(parsed.error.issues[0]?.message || "Invalid verification input");
        return;
      }

      if (otpSecondsLeft <= 0) {
        setFormError("This OTP has expired. Please resend a new OTP.");
        return;
      }

      setFormError(null);
      await verifyMutation.mutateAsync(parsed.data);
    },
  });

  const handleResendOtp = async () => {
    const currentEmail = form.state.values.email;
    const emailCheck = verifyEmailZodSchema.shape.email.safeParse(currentEmail);

    if (!emailCheck.success) {
      setFormError(emailCheck.error.issues[0]?.message || "Please enter a valid email before resending OTP.");
      return;
    }

    setFormError(null);
    await resendMutation.mutateAsync({ email: currentEmail });
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card/80 p-6 shadow-[0_0_50px_rgba(255,87,34,0.08)] backdrop-blur md:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FFD700]">VERIFY EMAIL</p>
        <h1 className="text-3xl font-extrabold text-white">Enter verification code</h1>
        <p className="text-sm text-[#a0a0a0]">We sent a 6-digit code to your email address.</p>
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
              const result = verifyEmailZodSchema.shape.email.safeParse(value);
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
              disabled={verifyMutation.isPending}
            />
          )}
        </form.Field>

        <form.Field
          name="otp"
          validators={{
            onChange: ({ value }) => {
              const result = verifyEmailZodSchema.shape.otp.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const showOtpError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
            const otpError = showOtpError ? String(field.state.meta.errors[0]) : null;

            return (
              <div className="space-y-2">
                <Label htmlFor="otp" className="font-medium">Verification Code</Label>
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  disabled={verifyMutation.isPending}
                  containerClassName="justify-center md:justify-start"
                  pattern="[0-9]*"
                  inputMode="numeric"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {otpError ? <p className="text-sm text-destructive">{otpError}</p> : null}
              </div>
            );
          }}
        </form.Field>

        <div className="rounded-lg border border-dark-border bg-[#101015] px-3 py-2 text-sm text-[#c8c8c8]">
          {resendSecondsLeft > 0 ? (
            <p className="mt-1 text-[#a0a0a0]">Resend OTP available in {formatTime(resendSecondsLeft)}</p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
              disabled={resendMutation.isPending || verifyMutation.isPending}
              className="mt-1 h-auto p-0 text-sm text-[#FFD700] hover:bg-transparent hover:text-[#FF5722]"
            >
              {resendMutation.isPending ? "Resending..." : "Resend OTP"}
            </Button>
          )}
        </div>

        {formError && (
          <div role="alert" className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]">
            {formError}
          </div>
        )}

        <AppSubmitButton
          isPending={verifyMutation.isPending}
          pendingLabel="Verifying..."
          className="btn-neon-primary mt-1"
          disabled={resendMutation.isPending}
        >
          Verify Email
        </AppSubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-[#a0a0a0]">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-[#FFD700] transition-colors hover:text-[#FF5722]">
          Go to sign in
        </Link>
      </p>
    </div>
  );
}
