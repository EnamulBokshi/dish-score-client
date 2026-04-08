"use client";

import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import GlobalSearchModal from "@/components/layout/GlobalSearchModal";
import DashboardMobildeSidebar from "@/components/layout/DashboardMobildeSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserInfo } from "@/types/user.types";
import { NavSection } from "@/types/dashboard.type";
import { cn } from "@/lib/utils";

interface GuestDashboardNavbarProps {
	userInfo: UserInfo;
	navItems: NavSection[];
	dashboardHome: string;
}

export default function GuestDashboardNavbar({ userInfo, navItems, dashboardHome }: GuestDashboardNavbarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();
	const isDarkTheme = resolvedTheme === "dark";

	useEffect(() => {
		const checkSmallerScreen = () => {
			setIsMobileMenuOpen(window.innerWidth < 768);
		};

		checkSmallerScreen();
		window.addEventListener("resize", checkSmallerScreen);

		return () => {
			window.removeEventListener("resize", checkSmallerScreen);
		};
	}, []);

	return (
		<header className="flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 text-foreground backdrop-blur-sm md:px-6 dark:border-border dark:bg-background/95">
			<Sheet open={isOpen && isMobileMenuOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" aria-label="Open sidebar menu" className="border-border bg-background text-foreground md:hidden dark:bg-input/30">
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-64 border-border bg-card p-0 text-foreground dark:border-border dark:bg-card">
					<DashboardMobildeSidebar userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
				</SheetContent>
			</Sheet>

			<div className="flex min-w-0 flex-1 items-center gap-3">
				<Link href={dashboardHome} className="min-w-0 font-bold text-primary">
					<span className="sr-only">Dish Score</span>
					<span aria-hidden className="text-lg sm:text-xl">🍽️ Dish Score</span>
				</Link>
				<span className="hidden rounded-full border border-dashed border-[#d8c0af] bg-[#fff6ee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a15d31] dark:border-white/10 dark:bg-white/5 dark:text-neon-gold sm:inline-flex">
					Guest Demo
				</span>
				<div className="hidden min-w-0 flex-1 sm:block">
					<GlobalSearchModal variant="dashboard" enableShortcut />
				</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"text-foreground hover:bg-muted",
						isDarkTheme ? "text-[#f7efe9]" : "text-[#5d4b43]",
					)}
					onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
					aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
				>
					{isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
				</Button>

				<Button asChild className="btn-neon-primary h-10 rounded-full px-4 sm:px-5">
					<Link href="/login">Sign In</Link>
				</Button>
			</div>
		</header>
	);
}