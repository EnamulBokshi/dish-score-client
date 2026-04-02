import { UserRole } from "@/types/enums";


export const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/forget-password',
    '/reset-password',
    '/verify-email',
];


export const isAuthRoute = (path: string): boolean => {
    return authRoutes.some((route:string) => route === path);
}


export type RouteConfig = {
    exact: string[],
    pattern: RegExp[],
}

export const commonProtectedRoutes: RouteConfig = {
    exact: ['/my-profile', '/change-password'],
    pattern: []
}

export const ownerProtectedRoutes: RouteConfig = {
    pattern: [/^\/owner\/dashboard/], // Matches any path that starts with /owner/dashboard
    exact: []
}

export const adminOrSuperAdminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboard/], // Matches any path that starts with /admin/dashboard
    exact: []
}
export const consumerProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: []
}


export const isRouteMatches = (pathName: string, routes: RouteConfig): boolean => {
    const { exact, pattern } = routes;
    if(exact.includes(pathName)) {
        return true;
    }
    return pattern.some((regex: RegExp) => regex.test(pathName));
}


export const getRouteOwner = (pathName: string): UserRole | null | 'COMMON' => {
    if(isRouteMatches(pathName, commonProtectedRoutes)) {
        return 'COMMON';
    }
    if(isRouteMatches(pathName, ownerProtectedRoutes)) {
        return UserRole.OWNER;
    }
    if(isRouteMatches(pathName, adminOrSuperAdminProtectedRoutes)) {
        return UserRole.ADMIN;
    }
    if(isRouteMatches(pathName, consumerProtectedRoutes)) {
        return UserRole.CONSUMER;
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    switch(role) {
        case UserRole.OWNER:
            return '/owner/dashboard';
        case UserRole.ADMIN:
            return '/admin/dashboard';
        case UserRole.CONSUMER:
            return '/dashboard';
        default:
            return '/';
    }
}

export const isValidRedirectPath = (redirectPath: string, role: UserRole) => {
    role = role === UserRole.SUPER_ADMIN ? UserRole.ADMIN : role; // Treat SUPER_ADMIN as ADMIN for redirect purposes
    const routeOwner = getRouteOwner(redirectPath);
    
    if(!routeOwner || routeOwner === 'COMMON') {
        return true; // Allow redirect to public routes
    }
    if(routeOwner === role) {
        return true;
    }
    return false;
}