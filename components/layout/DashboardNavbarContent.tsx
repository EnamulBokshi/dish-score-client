"use client"
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { NavSection } from '@/types/dashboard.type';
import { UserInfo } from '@/types/user.types';
import DashboardMobildeSidebar from './DashboardMobildeSidebar';
import DashboardNotification from './DashboardNotification';
import UserDropdown from './UserDropdown';
import GlobalSearchModal from './GlobalSearchModal';


interface DashboardNavbarContentProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}
export default function DashboardNavbarContent({
    userInfo,
    navItems,
    dashboardHome
}: DashboardNavbarContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(()=> {
    const checkSmallerScreen = ()=> {
      setIsMobileMenuOpen(window.innerWidth < 768);
    }
    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);
    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    }
  }, [])

  return (
    <header className="flex h-16 items-center gap-3 border-b bg-background px-4 md:px-6">
      {/* Mobile menu toggle button */}
      <Sheet open={isOpen && isMobileMenuOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open sidebar menu" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        {/* Mobile Sidebar Content */}
        <SheetContent side='left' className="w-64 p-0">
          <DashboardMobildeSidebar userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
        </SheetContent>
      </Sheet>

      {/* Search takes all remaining space */}
      <div className="flex min-w-0 flex-1 items-center">
        <div className='hidden w-full sm:block'>
          <GlobalSearchModal variant="dashboard" enableShortcut />
        </div>
      </div>

      {/* Right-side grouped actions */}
      <div className="ml-auto flex items-center gap-2">
        <DashboardNotification userInfo={userInfo} />
        <UserDropdown userInfo={userInfo} />
      </div>
    </header>
  )
}
