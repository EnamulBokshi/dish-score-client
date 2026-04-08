"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/services/auth.services";
import { UserInfo } from "@/types/user.types";
import { getDefaultDashboardRoute } from "@/lib/routeUtils";
import { UserRole } from "@/types/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

import { LayoutDashboard, LogOut, Lock, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface UserDropdownProps {
    userInfo: UserInfo;
}


export default function UserDropdown({ userInfo }: UserDropdownProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const dashboardRole = userInfo.role === UserRole.SUPER_ADMIN ? UserRole.ADMIN : userInfo.role;
  const dashboardHref = getDefaultDashboardRoute(dashboardRole);
  const profileImage = userInfo.profilePhoto?.trim() || "";
  const fallbackInitial = userInfo.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const isDarkTheme = resolvedTheme === "dark";

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
            className="h-10 w-10 rounded-full border-[#d2c0b7] bg-[#fff8f4] p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Open user menu"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={profileImage} alt={userInfo.name} />
              <AvatarFallback className="bg-[#f6e9e2] text-sm font-semibold text-[#9c4f3a]">{fallbackInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"w-64 rounded-xl border-[#e6d4cb] bg-[#fff8f5] p-1.5 shadow-xl"} align={"end"}>
            <DropdownMenuGroup>
            <DropdownMenuLabel >
                <div className={"flex items-center gap-3 rounded-lg bg-[#fff0e8] p-2.5"}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profileImage} alt={userInfo.name} />
                      <AvatarFallback className="bg-[#f6e0d5] text-sm font-semibold text-[#9c4f3a]">{fallbackInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col space-y-0.5">
                      <p className="truncate text-sm font-semibold text-[#4f3027]">{userInfo.name}</p>
                      <p className="truncate text-xs text-[#8a6a5f]">
                        {userInfo.email}
                      </p>
                      <p className="truncate text-xs text-[#b8956f] font-medium capitalize">
                        {userInfo.role.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                </div>
            </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer rounded-md text-[#4f3027] focus:bg-[#ffe4d8] focus:text-[#9c4f3a]">
              <Link href={dashboardHref}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-md text-[#4f3027] focus:bg-[#ffe4d8] focus:text-[#9c4f3a]">
              <Link href="/my-profile">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer rounded-md text-[#4f3027] focus:bg-[#ffe4d8] focus:text-[#9c4f3a]">
              <Link href="/change-password">
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleThemeToggle}
              className="cursor-pointer rounded-md text-[#4f3027] focus:bg-[#ffe4d8] focus:text-[#9c4f3a]"
            >
              {isDarkTheme ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className={"cursor-pointer rounded-md text-red-600 focus:bg-red-50 focus:text-red-700"}
            >
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "Logging out..." : "Logout"}
            </DropdownMenuItem>

            </DropdownMenuContent>
    </DropdownMenu>
  )
}
