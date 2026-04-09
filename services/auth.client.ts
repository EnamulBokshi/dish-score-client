import axios from "axios";

import {
  IRegisterPayload,
  IVerifyEmailPayload,
  IChangePasswordPayload,
  IForgetPasswordPayload,
  IResetPasswordPayload,
} from "@/zod/auth.schema";

type RegisterInput = Omit<IRegisterPayload, "confirmPassword">;
type ChangePasswordInput = Omit<IChangePasswordPayload, "confirmPassword">;
type ResetPasswordInput = Omit<IResetPasswordPayload, "confirmPassword">;

export async function signUpWithEmail(payload: RegisterInput, image?: File | null) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  if (image) {
    formData.append("image", image);
  }

  const response = await axios.post(`${baseUrl}/auth/sign-up/email`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function verifyEmail(payload: IVerifyEmailPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await axios.post(`${baseUrl}/auth/verify-email`, payload);
  return response.data;
}

export async function resendOtp(payload: { email: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await axios.post(`${baseUrl}/auth/resend-otp`, payload);
  return response.data;
}

export async function changePassword(payload: ChangePasswordInput) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await axios.post(`${baseUrl}/auth/change-password`, payload, {
    withCredentials: true,
  });
  return response.data;
}

export async function forgetPassword(payload: IForgetPasswordPayload) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await axios.post(`${baseUrl}/auth/forget-password`, payload);
  return response.data;
}

export async function resetPassword(payload: ResetPasswordInput) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const response = await axios.post(`${baseUrl}/auth/reset-password`, payload);
  return response.data;
}

export function continueWithGoogle(options?: {
  redirectTo?: string;
  role?: "CONSUMER" | "OWNER";
}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const oauthUrl = new URL(`${baseUrl}/auth/login/google`);

  if (options?.redirectTo) {
    oauthUrl.searchParams.set("redirect", options.redirectTo);
  }

  if (options?.role) {
    oauthUrl.searchParams.set("role", options.role);
  }

  window.location.assign(oauthUrl.toString());
}

/**
 * Handle Google OAuth callback by extracting tokens from URL query params
 * and setting them as cookies. Call this on the redirect destination page.
 */
export function handleGoogleAuthCallback() {
  if (typeof window === "undefined") return;

  const searchParams = new URLSearchParams(window.location.search);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const sessionToken = searchParams.get("sessionToken");

  if (accessToken && refreshToken && sessionToken) {
    // Set cookies via document.cookie (browser automatically handles cookies on same domain)
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    const secureFlagStr = process.env.NEXT_PUBLIC_ENV === "production" ? ";secure" : "";
    const sameSiteFlagStr =
      process.env.NEXT_PUBLIC_ENV === "production" ? ";samesite=none" : ";samesite=lax";

    document.cookie = `accessToken=${accessToken};path=/;max-age=${Math.floor(maxAge / 1000)}${secureFlagStr}${sameSiteFlagStr}`;
    document.cookie = `refreshToken=${refreshToken};path=/;max-age=${Math.floor(maxAge / 1000)}${secureFlagStr}${sameSiteFlagStr}`;
    document.cookie = `__Secure-better-auth.session_token=${sessionToken};path=/;max-age=${Math.floor(maxAge / 1000)}${secureFlagStr}${sameSiteFlagStr}`;

    // Clean up URL by removing token params
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("accessToken");
    cleanUrl.searchParams.delete("refreshToken");
    cleanUrl.searchParams.delete("sessionToken");
    window.history.replaceState({}, document.title, cleanUrl.toString());

    return { accessToken, refreshToken, sessionToken };
  }

  return null;
}
