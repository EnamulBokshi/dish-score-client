"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { continueWithGoogle } from "@/services/auth.client";
import { loginAction } from "@/services/auth.services";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.schema";

export default function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || undefined;

  const loginMutation = useMutation({
    mutationFn: async ({ payload, to }: { payload: ILoginPayload; to?: string }) => {
      return loginAction(payload, to);
    },
    onSuccess: (res) => {
      if (res && "success" in res && res.success === false) {
        setFormError(res.error || res.message || "Failed to login");
      } else {
        setFormError(null);
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to complete login";
      setFormError(message);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = loginZodSchema.safeParse(value);

      if (!parsed.success) {
        setFormError(null);
        toast.error(parsed.error.issues[0]?.message || "Invalid login input");
        return;
      }

      setFormError(null);
      await loginMutation.mutateAsync({ payload: parsed.data, to: redirectTo });
    },
  });



  return (
    <div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card/80 p-6 shadow-[0_0_50px_rgba(255,87,34,0.08)] backdrop-blur md:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FFD700]">WELCOME BACK</p>
        <h1 className="text-3xl font-extrabold text-white">Sign in to Dish Score</h1>
        <p className="text-sm text-[#a0a0a0]">Review dishes, manage restaurants, and track your foodie reputation.</p>
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
              const result = loginZodSchema.shape.email.safeParse(value);
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
              disabled={loginMutation.isPending}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = loginZodSchema.shape.password.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <AppField
              field={field}
              label="Password"
              type="password"
              placeholder="Enter your password"
              prepend={<Lock className="h-4 w-4 text-[#a0a0a0]" />}
              disabled={loginMutation.isPending}
            />
          )}
        </form.Field>

        <div className="flex items-center justify-end">
          <Link href="/forget-password" className="text-xs text-[#FFD700] transition-colors hover:text-[#FF5722]">
            Forgot password?
          </Link>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]"
          >
            {formError}
          </div>
        )}

        <AppSubmitButton
          isPending={loginMutation.isPending}
          pendingLabel="Signing in..."
          className="btn-neon-primary mt-1"
        >
          Sign In
        </AppSubmitButton>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dark-border" />
          </div>
          <span className="relative flex justify-center text-xs uppercase tracking-[0.12em] text-[#8f8f98]">
            <span className="bg-dark-card px-2">or</span>
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full border-dark-border bg-[#121217] text-white hover:bg-[#1a1a22]"
          disabled={loginMutation.isPending}
          onClick={() => {
            try {
              continueWithGoogle({ redirectTo });
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Failed to start Google login");
            }
          }}
        >
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
            G
          </span>
          Continue with Google
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#a0a0a0]">
        New to Dish Score?{" "}
        <Link href="/signup" className="font-medium text-[#FFD700] transition-colors hover:text-[#FF5722]">
          Create an account
        </Link>
      </p>
    </div>
  );
}
