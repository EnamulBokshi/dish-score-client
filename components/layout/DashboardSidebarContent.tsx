"use client"

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconsMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps{
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}
export default function DashbordSidebarContent(
    {
        userInfo,
        navItems,
        dashboardHome
    }: DashboardSidebarContentProps
) {

    const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card">
        {/* Logo */}

        <div className="flex h-16 items-center border-b px-6">  
            <Link href={dashboardHome}>
                <span className="text-2xl font-bold text-primary">Dish Score</span>
            </Link>
        </div>
        {/* Navigation Items */}

        <ScrollArea className="flex-1 px-2 py-4">

            <nav className="space-y-6">

            {navItems.map((section, index) => (
                <div key={index} className="mb-6">
                    {section.title && (
                        <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                            {section.title}
                        </h3>
                    )}
                    <div className="mt-2 space-y-1">
                        {section.items.map((item, idx) => {
                            const isActive = item.href === pathname;
                            const Icon = getIconComponent(item.icon);
                            return (
                                // `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/10"}`
                                <Link href={item.href} key={idx} className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/10 hover:text-accent-foreground"
                                )}>
                                    {/* <Icon /> */}
                                    <Icon />
                                    <span>
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                    {
                        index < navItems.length - 1 &&  (
                            <Separator className="my-4" />
                        )
                    }
                </div>
            ))}
            </nav>
            </ScrollArea>

        {/* User info at bottom */}
        <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="font-bold ">
                        {
                            userInfo?.name.charAt(0).toUpperCase()
                        }
                    </span>
                </div>
                <div>
                    <p className="text-sm font-medium truncate">{userInfo?.name}</p>
                    <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
                </div>
            </div>
        </div>
    </div>
  )
}
