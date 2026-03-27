"use client";

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

interface NoficationProps {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "schedule" | "system" | "user";
  timestamp: Date;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: NoficationProps[] = [
  {
    id: "1",
    title: "New Appointment Scheduled",
    message:
      "You have a new appointment with Dr. Smith on September 15th at 10:00 AM.",
    type: "appointment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
  },
  {
    id: "2",
    title: "Schedule Updated",
    message: "Your schedule has been updated for the week of September 10th.",
    type: "schedule",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
  },
  {
    id: "3",
    title: "System Maintenance",
    message:
      "The system will undergo maintenance on September 20th from 1:00 AM to 3:00 AM.",
    type: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: false,
  },
];

const getNotificationIcon = (type: NoficationProps["type"]) => {
  switch (type) {
    case "appointment":
      return "📅";
    case "schedule":
      return "🗓️";
    case "system":
      return "⚙️";
    case "user":
      return "👤";
    default:
      return "🔔";
  }
};

export default function DashboardNotification() {
  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (notif) => !notif.isRead,
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open notifications" className="relative">
          <span className="text-2xl">🔔</span>

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
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex items-start gap-3 ${
                  !notif.isRead ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
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
                            formatDistanceToNow(notif.timestamp,{addSuffix: true})
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

        <DropdownMenuItem className="justify-center cursor-pointer text-center">
            Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* Dropdown content with notifications will go here */}
    </DropdownMenu>
  );
}
