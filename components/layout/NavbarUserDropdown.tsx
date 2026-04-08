"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/services/auth.services";
import { UserInfo } from "@/types/user.types";
import { getDefaultDashboardRoute } from "@/lib/routeUtils";
import { UserRole } from "@/types/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

import { LayoutDashboard, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface NavbarUserDropdownProps {
  userInfo: UserInfo;
  isHomePage?: boolean;
}

/**
 * Lightweight user dropdown for landing page navbar
 * Shows: Dashboard link + Logout button
 * Used only in: Navbar.tsx (landing page)
 * For full menu, use: UserDropdown.tsx (dashboard/authenticated pages)
 */
export default function NavbarUserDropdown({ userInfo, isHomePage = false }: NavbarUserDropdownProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const dashboardRole = userInfo.role === UserRole.SUPER_ADMIN ? UserRole.ADMIN : userInfo.role;
  const dashboardHref = getDefaultDashboardRoute(dashboardRole);
  const profileImage = userInfo.profilePhoto?.trim() || "";
  const fallbackInitial = userInfo.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const isDarkTheme = resolvedTheme === "dark";

  const triggerClassName = isHomePage
    ? "h-10 w-10 rounded-full border-white/20 bg-white/5 p-0 shadow-sm transition-all duration-200 hover:bg-white/10"
    : "h-10 w-10 rounded-full border border-[#bfaea5] bg-white p-0 text-[#5d4b43] shadow-[0_8px_18px_-14px_rgba(59,40,32,0.55)] transition-all duration-200 hover:border-[#b09c91] hover:bg-[#f7efea]";

  const fallbackClassName = isHomePage
    ? "bg-white/10 text-sm font-semibold text-white"
    : "bg-[#efe5df] text-sm font-semibold text-[#624d44]";

  const handleThemeToggle = () => {
    const nextTheme = isDarkTheme ? "light" : "dark";
    setTheme(nextTheme);
    toast.success(`Theme changed to ${nextTheme === "dark" ? "Dark" : "Light"}`);
  };

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const response = await logoutAction();
        if (!response.success) {
          toast.error(response.message || "Failed to logout");
          return;
        }

        toast.success("Logged out successfully");
        router.replace("/login");
        router.refresh();
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Failed to logout");
      }
    });
  };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className={triggerClassName}
            aria-label="Open user menu"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={profileImage} alt={userInfo.name} />
              <AvatarFallback className={fallbackClassName}>{fallbackInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"w-56 rounded-lg border-white/10 bg-[#1a1218]/95 p-1.5 shadow-xl backdrop-blur-lg"} align={"end"}>
            <DropdownMenuGroup>
            <DropdownMenuLabel >
                <div className={"flex flex-col space-y-1"}>
                    <p className="truncate text-sm font-medium text-white">{userInfo.name}</p>
                    <p className="truncate text-xs text-white/60">
                        {userInfo.email}
                    </p>
                    <p className="truncate text-xs text-white/70 capitalize">
                        {userInfo.role.toLowerCase().replace("_", " ")}
                    </p>
                </div>
            </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10" />

            <DropdownMenuItem asChild className="cursor-pointer rounded-md text-white/90 focus:bg-white/10 focus:text-white">
              <Link href={dashboardHref}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleThemeToggle}
              className="cursor-pointer rounded-md text-white/90 focus:bg-white/10 focus:text-white"
            >
              {isDarkTheme ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className={"cursor-pointer rounded-md text-red-400 focus:bg-red-500/20 focus:text-red-300"}
            >
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "Logging out..." : "Logout"}
            </DropdownMenuItem>

            </DropdownMenuContent>
    </DropdownMenu>
  )
}
