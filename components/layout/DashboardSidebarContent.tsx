"use client";

import { useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getIconComponent } from "@/lib/iconsMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}
export default function DashbordSidebarContent(
    {
        userInfo,
        navItems,
        dashboardHome,
    }: DashboardSidebarContentProps,
) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = window.localStorage.getItem("dashboard.sidebar.collapsed");
        if (saved === "true") {
            setIsCollapsed(true);
        }
    }, []);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        const width = isCollapsed ? "5rem" : "16rem";
        document.documentElement.style.setProperty("--dashboard-sidebar-width", width);
        window.localStorage.setItem("dashboard.sidebar.collapsed", String(isCollapsed));
    }, [isCollapsed, isMounted]);

    const pathname = usePathname();
    const fallbackInitial = userInfo?.name?.charAt(0)?.toUpperCase() || "U";
    const widthClass = isCollapsed ? "w-20" : "w-64";

  return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-40 hidden h-screen flex-col border-r bg-card transition-[width] duration-300 md:flex",
                widthClass,
            )}
        >
            <div className={cn("flex h-16 items-center border-b", isCollapsed ? "justify-center px-2" : "px-4") }>
                <Link href={dashboardHome} className="min-w-0">
                    <span className="sr-only">Dish Score</span>
                    <span
                        aria-hidden
                        className={cn(
                            "font-bold text-primary",
                            isCollapsed ? "text-lg" : "text-xl",
                        )}
                    >
                        {isCollapsed ? "🍽️" : "🍽️ Dish Score"}
                    </span>
                </Link>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className={cn("ml-auto h-8 w-8", isCollapsed && "ml-0")}
                >
                    {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                </Button>
            </div>

            <ScrollArea className={cn("flex-1 py-4", isCollapsed ? "px-1.5" : "px-2")}>
                <nav className="space-y-6">
                    {navItems.map((section, index) => (
                        <div key={index} className="mb-6">
                            {section.title && !isCollapsed ? (
                                <h3 className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    {section.title}
                                </h3>
                            ) : null}
                            <div className={cn("space-y-1", !isCollapsed && "mt-2")}>
                                {section.items.map((item, idx) => {
                                    const isActive = item.href === pathname;
                                    const Icon = getIconComponent(item.icon);

                                    return (
                                        <Link
                                            href={item.href}
                                            key={idx}
                                            title={isCollapsed ? item.label : undefined}
                                            className={cn(
                                                "flex rounded-md text-sm font-medium transition-colors",
                                                isCollapsed ? "items-center justify-center px-2 py-2.5" : "items-center gap-3 px-3 py-2",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted/10 hover:text-accent-foreground",
                                            )}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
                                        </Link>
                                    );
                                })}
                            </div>
                            {index < navItems.length - 1 && !isCollapsed ? <Separator className="my-4" /> : null}
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            <div className={cn("mt-auto border-t", isCollapsed ? "p-2" : "p-4")}>
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2") }>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                        <span className="font-bold">{fallbackInitial}</span>
                    </div>
                    {!isCollapsed ? (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{userInfo?.name || "User"}</p>
                            <p className="truncate text-xs text-muted-foreground">{userInfo?.email || "No email"}</p>
                        </div>
                    ) : null}
        </div>
            </div>
        </aside>
    );
}
