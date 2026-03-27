"use server";
import { httpClient } from "@/lib/httpClient";
import { getDefaultDashboardRoute, isValidRedirectPath } from "@/lib/routeUtils";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { UserRole } from "@/types/enums";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BaseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BaseApiUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined!");
}


export async function setNewRefreshToken(
  refreshToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BaseApiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }
    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) {
      await setTokenInCookies("accessToken", accessToken);
    }
    if (newRefreshToken) {
      await setTokenInCookies("refreshToken", newRefreshToken);
    }
    if (token) {
      await setTokenInCookies("better-auth.session_token", token);
    }

    return true;
  } catch (error: any) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

export const getUserInfo = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!accessToken) {
    return null;
  }

  const res = await fetch(`${BaseApiUrl}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}; refreshToken=${refreshToken}`,
    },
  });
  if (!res.ok) {
    return null;
  }

  const { data } = await res.json();
  return data;
};

export const loginAction = async (payload:ILoginPayload, redirectTo?: string): Promise<ILoginResponse|ApiErrorResponse> => {
    // console.log("Login action called with payload:", payload);
    const parsedPayload = loginZodSchema.safeParse(payload);
    
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";

        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<ILoginResponse>('auth/sign-in/email', parsedPayload.data);
        const {accessToken, refreshToken, token,user} = response.data;
        
        const {role, emailVerified, needPasswordChange,email} = user;

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token);

        if(!emailVerified){
            redirect('/verify-email');
        }
        else if(needPasswordChange){
            redirect(`/reset-password?email=${email}`)
        }
        else {
            // redirect(redirectTo || "/dashboard"); 
            const targetPath = redirectTo && isValidRedirectPath(redirectTo, role as UserRole) ? redirectTo : getDefaultDashboardRoute(role as UserRole); 
            redirect(targetPath);
        }

    } catch (error:any) {
        if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
            throw error; // Rethrow redirect errors to be handled by Next.js
        }
        if(error && error.response && error.response.data.message === "Email not verified"){
            redirect(`/verify-email?email=${payload.email}`);
        }
      const serverErrorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        (error instanceof Error ? error.message : "An unknown error occurred");

        return {
            success: false,
        message: String(serverErrorMessage),
        error: String(serverErrorMessage),
        }
    }
}