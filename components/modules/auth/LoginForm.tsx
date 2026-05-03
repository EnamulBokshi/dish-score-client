"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Mail, Lock } from "lucide-react"
import { toast } from "sonner"

import AppField from "@/components/layout/forms/AppFiled"
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton"
import { Button } from "@/components/ui/button"
import { enterGuestModeAction } from "@/services/auth.services"
import { continueWithGoogle } from "@/services/auth.client"
import { loginAction } from "@/services/auth.services"
import { ILoginPayload, loginZodSchema } from "@/zod/auth.schema"

export default function LoginForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") || undefined

  const loginMutation = useMutation({
    mutationFn: async ({
      payload,
      to,
    }: {
      payload: ILoginPayload
      to?: string
    }) => {
      return loginAction(payload, to)
    },
    onSuccess: (res) => {
      if (res && "success" in res && res.success === false) {
        setFormError(res.message || res.error || "Failed to login")
      } else {
        setFormError(null)
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String(
                (error as { message?: unknown }).message ??
                  "Unable to complete login"
              )
            : "Unable to complete login"
      setFormError(message)
    },
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = loginZodSchema.safeParse(value)

      if (!parsed.success) {
        setFormError(null)
        toast.error(parsed.error.issues[0]?.message || "Invalid login input")
        return
      }

      setFormError(null)
      await loginMutation.mutateAsync({ payload: parsed.data, to: redirectTo })
    },
  })

  const handleGuestLogin = async () => {
    setFormError(null)

    try {
      const response = await enterGuestModeAction()

      if (!response.success) {
        toast.error(response.message || "Failed to enter guest mode")
        return
      }

      toast.success("Entering guest demo mode")

      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to enter guest mode"
      toast.error(message)
    }
  }

  const adminDemoLogin = async () => {
    console.log(process.env.SUPER_ADMIN_EMAIL, process.env.SUPER_ADMIN_PASS)
    await loginMutation.mutateAsync({
      payload:{
        email: process.env.SUPER_ADMIN_EMAIL as string || "superadmin@healthcare.com",
        password: process.env.SUPER_ADMIN_PASS as string || "superadminpassword",
      },
      to: redirectTo,
    })
  }

  const reviwerDemoLogin = async () => {
    console.log(process.env.REVIEWER_EMAIL, process.env.REVIEWER_PASS)
    await loginMutation.mutateAsync({
      payload: {
        email: process.env.REVIEWER_EMAIL as string || "haque22205101946@diu.edu.bd",
        password: process.env.REVIEWER_PASS as string || "haque22205101946",
      },
      to: redirectTo,
    })
  }

  const ownerDemoLogin = async () => {
    console.log(process.env.OWNER_EMAIL, process.env.OWNER_PASS)
    await loginMutation.mutateAsync({
      payload: {
        email: process.env.OWNER_EMAIL as string || "enamulhoque11200@gmail.com",
        password: process.env.OWNER_PASS as string || "123456789",
      },
      to: redirectTo,
    })
  }
  // const superAdminDemoLogin = async() => {

  // }

  return (
    <div className="border-dark-border bg-dark-card/80 w-full max-w-md rounded-2xl border p-6 shadow-[0_0_50px_rgba(255,87,34,0.08)] backdrop-blur md:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#FFD700]">
          WELCOME BACK
        </p>
        <h1 className="text-3xl font-extrabold text-white">
          Sign in to Dish Score
        </h1>
        <p className="text-sm text-[#a0a0a0]">
          Review dishes, manage restaurants, and track your foodie reputation.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = loginZodSchema.shape.email.safeParse(value)
              return result.success
                ? undefined
                : result.error.issues[0]?.message
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
              const result = loginZodSchema.shape.password.safeParse(value)
              return result.success
                ? undefined
                : result.error.issues[0]?.message
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
          <Link
            href="/forget-password"
            className="text-xs text-[#FFD700] transition-colors hover:text-[#FF5722]"
          >
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
            <span className="border-dark-border w-full border-t" />
          </div>
          <span className="relative flex justify-center text-xs tracking-[0.12em] text-[#8f8f98] uppercase">
            <span className="bg-dark-card px-2">or</span>
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-dark-border h-10 w-full bg-[#121217] text-white hover:bg-[#1a1a22]"
          disabled={loginMutation.isPending}
          onClick={() => {
            try {
              continueWithGoogle({ redirectTo })
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to start Google login"
              )
            }
          }}
        >
          
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
            G
          </span>
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full border-[#2d2d37] bg-transparent text-[#e8e8eb] hover:bg-white/5 hover:text-white"
          onClick={() => {
            void handleGuestLogin()
          }}
        >
          Continue as Guest
        </Button>
      </form>
          <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="border-dark-border w-full border-t" />
          </div>
          <span className="relative flex justify-center text-xs tracking-[0.12em] text-[#8f8f98] uppercase">
            <span className="bg-dark-card px-2">or</span>
          </span>
        </div>
        <div className="flex  gap-2 justify-between items-center">
          <div className="flex rounded-md justify-center items-center">
            <Button variant={"outline"} onClick={()=> adminDemoLogin()}>Demo Admin Login</Button>
          </div>
          <div className="flex rounded-md justify-center items-center">
            <Button variant={"outline"} onClick={()=> reviwerDemoLogin()}>Demo Reviwer Login</Button>

          </div>
        </div>
      <p className="mt-6 text-center text-sm text-[#a0a0a0]">
        New to Dish Score?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#FFD700] transition-colors hover:text-[#FF5722]"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
