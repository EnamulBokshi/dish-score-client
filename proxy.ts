import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
} from "./lib/routeUtils";
import { getUserInfo, setNewRefreshToken } from "./services/auth.services";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { UserRole } from "./types/enums";
import { jwtUtils } from "./lib/jwtUtils";

const jwtAccessSecret =
  process.env.ACCESS_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET;

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const newToken = await setNewRefreshToken(refreshToken);
    return newToken;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const verifiedTokenResult =
      accessToken && jwtAccessSecret
        ? jwtUtils.verifyToken(accessToken, jwtAccessSecret)
        : { success: false as const, data: undefined };

    const decodedAccessToken = verifiedTokenResult.success
      ? verifiedTokenResult.data
      : null;

    let userInfo = null;
    if (accessToken && !verifiedTokenResult.success) {
      userInfo = await getUserInfo();
    }

    const isValidAccessToken =
      verifiedTokenResult.success || Boolean(userInfo);

    let userRole: UserRole | null | "COMMON" = null;

    if (decodedAccessToken) {
      userRole = decodedAccessToken.role as UserRole;
    } else if (userInfo?.role) {
      userRole = userInfo.role as UserRole;
    }
    const routeOwner = getRouteOwner(pathname);

    userRole = userRole === UserRole.SUPER_ADMIN ? UserRole.ADMIN : userRole;

    const isAuth = isAuthRoute(pathname);

    // Proactively refresh token if it's expiring soon
    if (
      accessToken &&
      refreshToken &&
      isValidAccessToken &&
      await isTokenExpiringSoon(accessToken)
    ) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);
        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token in middleware:", error);
      }

      return response;
    }
    // Rule-1: If the route is an auth route and user is authenticated, redirect to dashboard (prevents accessing login/signup page when already logged in)
    if (isAuth && isValidAccessToken) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      

      // case-2: user trying to forget password, and has the email query param, allow access to reset password page
      if (email) {
        return NextResponse.next();
      }
      // case-3: user is not logged in
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }
    // Rule-2: allow user to access public routes
    if (!routeOwner) {
      return NextResponse.next();
    }

    // Rule-3: If the route is protected and user is not authenticated, redirect to login page
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    if (accessToken) {
      userInfo = userInfo || await getUserInfo();
      // console.log("userInfo in middleware:", userInfo);

      if (!userRole && userInfo?.role) {
        userRole = userInfo.role as UserRole;
      }

      // need email verification checks
      if(userInfo && !userInfo.emailVerified){
        if(pathname !== "/verify-email"){
            const verifyEmailUrl = new URL("/verify-email", request.url);
            verifyEmailUrl.searchParams.set("email", userInfo.email);
            return NextResponse.redirect(verifyEmailUrl);
        }
        return NextResponse.next();
      }

      if(userInfo && userInfo.emailVerified && pathname === "/verify-email"){
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url))
      }
      
      

     
    }

    // Rule-4: allow access common protected routes to any authenticated user
    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }

    // Rule-5: User trying to visit role based protected route, check if user's role matches the route's required role
    if (routeOwner !== userRole) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    // Rule-6: If user's role matches the route's required role, allow access
    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
