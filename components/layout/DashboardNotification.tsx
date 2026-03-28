"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Building2, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRole } from "@/types/enums";
import { UserInfo } from "@/types/user.types";
import {
  fetchLatestRestaurants,
  fetchLatestReviews,
  fetchMyReviewsForNotifications,
  INotificationRestaurant,
  INotificationReview,
} from "@/services/notification.client";

interface DashboardNotificationProps {
  userInfo?: UserInfo;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "like" | "review" | "restaurant" | "system";
  timestamp: string;
  href?: string;
  isRead: boolean;
}

interface NotificationSnapshot {
  reviewIds: string[];
  restaurantIds: string[];
  myReviewLikesById: Record<string, number>;
}

const MAX_NOTIFICATIONS = 30;

function createStorageKey(role?: UserRole) {
  return role ? `dashboard.notifications.${role}` : "dashboard.notifications.UNKNOWN";
}

function createSnapshotStorageKey(role?: UserRole) {
  return role ? `dashboard.notifications.snapshot.${role}` : "dashboard.notifications.snapshot.UNKNOWN";
}

function parseStoredNotifications(value: string | null): NotificationItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as NotificationItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseStoredSnapshot(value: string | null): NotificationSnapshot | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as NotificationSnapshot;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function getLikesCount(review: INotificationReview): number {
  return Array.isArray(review.likes) ? review.likes.length : 0;
}

function buildSnapshot(
  reviews: INotificationReview[],
  restaurants: INotificationRestaurant[],
  myReviews: INotificationReview[],
): NotificationSnapshot {
  const myReviewLikesById = myReviews.reduce<Record<string, number>>((acc, review) => {
    acc[review.id] = getLikesCount(review);
    return acc;
  }, {});

  return {
    reviewIds: reviews.map((item) => item.id),
    restaurantIds: restaurants.map((item) => item.id),
    myReviewLikesById,
  };
}

const getNotificationIcon = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="h-4.5 w-4.5 text-[#ff5f7a]" />;
    case "review":
      return <MessageCircle className="h-4.5 w-4.5 text-[#6ea8fe]" />;
    case "restaurant":
      return <Building2 className="h-4.5 w-4.5 text-[#8ddf99]" />;
    default:
      return <Bell className="h-4.5 w-4.5 text-[#f6cc68]" />;
  }
};

export default function DashboardNotification({ userInfo }: DashboardNotificationProps) {
  const router = useRouter();
  const role = userInfo?.role;
  const notificationsKey = createStorageKey(role);
  const snapshotKey = createSnapshotStorageKey(role);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const stored = parseStoredNotifications(window.localStorage.getItem(notificationsKey));
    setNotifications(stored);
  }, [notificationsKey]);

  useEffect(() => {
    let isCancelled = false;

    const pollNotifications = async () => {
      const [reviews, restaurants, myReviews] = await Promise.all([
        fetchLatestReviews(),
        fetchLatestRestaurants(),
        fetchMyReviewsForNotifications(role),
      ]);

      if (isCancelled) {
        return;
      }

      const currentSnapshot = buildSnapshot(reviews, restaurants, myReviews);
      const previousSnapshot = parseStoredSnapshot(window.localStorage.getItem(snapshotKey));

      if (!previousSnapshot) {
        window.localStorage.setItem(snapshotKey, JSON.stringify(currentSnapshot));
        return;
      }

      const generated: NotificationItem[] = [];

      const newReviewCount = reviews.filter(
        (review) => !previousSnapshot.reviewIds.includes(review.id),
      ).length;
      if (newReviewCount > 0) {
        generated.push({
          id: `new-review-${Date.now()}`,
          type: "review",
          title: `${newReviewCount} new review${newReviewCount > 1 ? "s" : ""} uploaded`,
          message: "Fresh community reviews are now available.",
          href: "/reviews",
          timestamp: new Date().toISOString(),
          isRead: false,
        });
      }

      const newRestaurant = restaurants.find(
        (restaurant) => !previousSnapshot.restaurantIds.includes(restaurant.id),
      );
      if (newRestaurant) {
        generated.push({
          id: `new-restaurant-${newRestaurant.id}-${Date.now()}`,
          type: "restaurant",
          title: "New restaurant added",
          message: `${newRestaurant.name || "A restaurant"} has joined the platform.`,
          href: "/dashboard/restaurants",
          timestamp: new Date().toISOString(),
          isRead: false,
        });
      }

      if (role === UserRole.CONSUMER) {
        const totalNewLikes = myReviews.reduce((count, review) => {
          const previousLikes = previousSnapshot.myReviewLikesById[review.id] ?? 0;
          const nowLikes = getLikesCount(review);
          return nowLikes > previousLikes ? count + (nowLikes - previousLikes) : count;
        }, 0);

        if (totalNewLikes > 0) {
          generated.push({
            id: `new-likes-${Date.now()}`,
            type: "like",
            title: "You got new likes",
            message: `Your reviews received ${totalNewLikes} new like${totalNewLikes > 1 ? "s" : ""}.`,
            href: "/dashboard/my-reviews",
            timestamp: new Date().toISOString(),
            isRead: false,
          });
        }
      }

      if (generated.length > 0) {
        setNotifications((prev) => {
          const next = [...generated, ...prev].slice(0, MAX_NOTIFICATIONS);
          window.localStorage.setItem(notificationsKey, JSON.stringify(next));
          return next;
        });
      }

      window.localStorage.setItem(snapshotKey, JSON.stringify(currentSnapshot));
    };

    void pollNotifications();
    const intervalId = window.setInterval(() => {
      void pollNotifications();
    }, 45_000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [notificationsKey, role, snapshotKey]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((item) => ({ ...item, isRead: true }));
      window.localStorage.setItem(notificationsKey, JSON.stringify(next));
      return next;
    });
  };

  const markOneAsRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, isRead: true } : item));
      window.localStorage.setItem(notificationsKey, JSON.stringify(next));
      return next;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open notifications" className="relative">
          <Bell className="h-4.5 w-4.5" />

          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs leading-none font-bold text-white"
              variant={"destructive"}
            >
              <span className="text-[10px]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={"w-80"} align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="ml-2" variant={"destructive"}>
                <span className="text-[10px]">
                  {unreadCount > 9 ? "9+" : unreadCount} new
                </span>
              </Badge>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ScrollArea className="h-75">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex items-start gap-3 ${
                  !notif.isRead ? "bg-primary/10" : ""
                }`}
                onClick={() => {
                  markOneAsRead(notif.id);
                  if (notif.href) {
                    router.push(notif.href);
                  }
                }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-muted/40">
                  {getNotificationIcon(notif.type)}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{notif.title}</p>
                    {
                        !notif.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-600"/>
                        )
                    }
                  </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                    <p className="text-xs text-muted-foreground">
                        {
                        formatDistanceToNow(new Date(notif.timestamp),{addSuffix: true})
                        }
                    </p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="justify-center cursor-pointer text-center" onClick={markAllAsRead}>
            Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
