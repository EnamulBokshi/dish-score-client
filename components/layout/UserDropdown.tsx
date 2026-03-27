"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/services/auth.services";
import { UserInfo } from "@/types/user.types";

import { Lock, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface UserDropdownProps {
    userInfo: UserInfo;
}


export default function UserDropdown({ userInfo }: UserDropdownProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
          <Button variant={"outline"} size={"icon"} className="rounded-full" aria-label="Open user menu">
            <span>{userInfo.name.charAt(0)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"w-56"}align={"end"}>
            <DropdownMenuGroup>
            <DropdownMenuLabel >
                <div className={"flex flex-col space-y-1"}>
                    <p className="text-sm font-medium">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {userInfo.email}
                    </p>
                    <p className="text-xs text-primary capitalize" >{userInfo.role.toLowerCase().replace("-", " ")}</p>
                </div>
            </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
            <Link href={"/my-profile"}>
                <User className="mr-2 h-4 w-4" />
                My Profile
             </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
            <Link href={"/change-password"}>
                <Lock className="mr-2 h-4 w-4" />
               Change Password
             </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className={"cursor-pointer text-red-600"}
            >
                <LogOut className="mr-2 h-4 w-4" />
                {isPending ? "Logging out..." : "Logout"}
            </DropdownMenuItem>

            </DropdownMenuContent>
    </DropdownMenu>
  )
}
