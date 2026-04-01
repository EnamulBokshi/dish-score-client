"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { UserRole, UserStatus } from "@/types/enums";
import { IUserDetails } from "@/types/user.types";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUserDetails | null;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error;
  onRetry?: () => void;
}

function getInitials(name?: string) {
  if (!name) {
    return "U";
  }

  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRoleBadgeVariant(role?: UserRole): "default" | "secondary" | "outline" {
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return "default";
  }

  if (role === UserRole.OWNER) {
    return "secondary";
  }

  return "outline";
}

function getStatusBadgeVariant(status?: UserStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === UserStatus.ACTIVE) {
    return "default";
  }

  if (status === UserStatus.BANNED || status === UserStatus.DELETED) {
    return "destructive";
  }

  if (status === UserStatus.INACTIVE) {
    return "secondary";
  }

  return "outline";
}

export default function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  isLoading,
  isError,
  error,
  onRetry,
}: UserDetailsDialogProps) {
  const profileCounts = {
    reviews: user?.reviews?.length ?? 0,
    likes: user?.likes?.length ?? 0,
    restaurants: user?.restaurants?.length ?? 0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border border-dark-border bg-dark-card/95 p-0 text-[#f4f4f5] backdrop-blur-lg">
        <DialogHeader>
          <div className="border-b border-dark-border px-6 pt-6 pb-4">
            <DialogTitle className="text-xl text-white">User Details</DialogTitle>
            <DialogDescription className="mt-1 text-[#a3a3ad]">
              Full account profile and related activity.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5 px-6 pb-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ) : isError ? (
            <ErrorState
              title="Failed to load user details"
              description="Please try again."
              error={error}
              retry={onRetry}
              variant="minimal"
            />
          ) : !user ? (
            <ErrorState
              title="User details unavailable"
              description="No details were returned for this account."
              variant="minimal"
            />
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/3 px-3 py-3">
                <Avatar size="default" className="size-12">
                  <AvatarImage src={user.profilePhoto ?? ""} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-base font-medium text-white">{user.name}</p>
                  <p className="text-sm text-[#c8c9d4]">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Reviews</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profileCounts.reviews}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Likes</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profileCounts.likes}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Restaurants</p>
                  <p className="mt-1 text-lg font-semibold text-white">{profileCounts.restaurants}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Account Created</p>
                  <p className="mt-1 text-sm text-white">{formatDateTime(user.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Last Updated</p>
                  <p className="mt-1 text-sm text-white">{formatDateTime(user.updatedAt)}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Admin Profile</p>
                  <p className="mt-1 text-sm text-white">{user.admin ? "Available" : "Not linked"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Reviewer Profile</p>
                  <p className="mt-1 text-sm text-white">{user.reviewerProfile ? "Available" : "Not linked"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5">
                  <p className="text-xs uppercase tracking-wide text-[#9fa0aa]">Owner Profile</p>
                  <p className="mt-1 text-sm text-white">{user.ownerProfile ? "Available" : "Not linked"}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-dark-border bg-dark-card/70 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="border-white/15 bg-white/3 text-white hover:bg-white/10"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
