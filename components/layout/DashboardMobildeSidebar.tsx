"use client";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SheetTitle } from '@/components/ui/sheet';
import { getIconComponent } from '@/lib/iconsMapper';
import { cn } from '@/lib/utils';
import { NavSection } from '@/types/dashboard.type';
import { UserInfo } from '@/types/user.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface DashboardMobildeSidebarProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}

export default function DashboardMobildeSidebar({ userInfo, navItems, dashboardHome }: DashboardMobildeSidebarProps) {
    const pathName = usePathname();
  return (
   <div className='flex h-full flex-col'>

    {/* Brand or Logo */}
    <div className="flex h-16 items-center border-b px-6">
        <Link href={dashboardHome}>
            <span className="text-2xl font-bold text-primary">HealthCare</span>
        </Link>
    </div>

    <SheetTitle className="px-6 pt-4">Menu</SheetTitle>

    {/* Navigation Items */}
    <ScrollArea>
        <nav>
            {navItems.map((section, index) => (
                <div key={index} className="mb-6">
                    {section.title && (
                        <h3 className="px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                            {section.title}
                        </h3>
                    )}
                    <div className="mt-2 space-y-1">
                        {section.items.map((item, idx) => {
                            const isActive = item.href === pathName;
                            const Icon = item.icon ? getIconComponent(item.icon) : null;
                            return (
                                // `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/10"}`
                                <Link href={item.href} key={idx} className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/10 hover:text-accent-foreground")}>
                                    {/* Icon can be added here */}
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span className='flex-1'>{item.label}</span>
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
        <div className="mt-auto p-4">
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    {/* if profile photo doesn't exists use custom avatar using name */}
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
