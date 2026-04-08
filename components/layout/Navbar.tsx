"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { HomeNavItems } from "@/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AIChatAssistant from "@/components/common/AIChatAssistant";
import GlobalSearchModal from "@/components/layout/GlobalSearchModal";
import NavbarUserDropdown from "@/components/layout/NavbarUserDropdown";
import { UserInfo } from "@/types/user.types";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
	name: string;
	href: string;
};

function isAuthItem(item: NavItem) {
	return item.name.toLowerCase() === "login" || item.name.toLowerCase() === "signup";
}

function formatLabel(label: string) {
	return label.charAt(0).toUpperCase() + label.slice(1);
}

interface NavbarProps {
	userInfo?: UserInfo | null;
}

export function Navbar({ userInfo }: NavbarProps) {
	const pathname = usePathname();
	const { resolvedTheme, setTheme } = useTheme();
	const [isScrolled, setIsScrolled] = useState(false);
	const isHomePageStyle = true;
	const isLoggedIn = Boolean(userInfo?.id);
	const isDarkTheme = resolvedTheme === "dark";

	useEffect(() => {
		function handleScroll() {
			setIsScrolled(window.scrollY > 8);
		}

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const authItems = HomeNavItems.filter(isAuthItem);
	const mainItems = HomeNavItems.filter((item) => !isAuthItem(item));

	const navClassName = isDarkTheme
		? isScrolled
			? "border-[#32252d] bg-[#0d0a11]/72 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.7)]"
			: "border-[#271b24] bg-[#08060c]/45 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.6)]"
		: isScrolled
			? "border-[#e7dbd4] bg-[#0d0a11]/72 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.7)]"
			: "border-[#dfd2ca] bg-[#08060c]/45 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.6)]";

	const brandClassName = "text-[#f8f1ec]";

	const navItemClassName = (active: boolean) => {
		return active
			? "bg-white/12 text-[#ffd7bf]"
			: "text-[#e8dede] hover:bg-white/8 hover:text-white";
	};

 	const loginButtonClassName = "text-[#efe6e6] hover:bg-white/8 hover:text-white";

	const mobileTriggerClassName = "text-[#efe6e6] hover:bg-white/8 hover:text-white";

	const themeToggleClassName = "text-[#efe6e6] hover:bg-white/8 hover:text-white";

	const handleThemeToggle = () => {
		const nextTheme = isDarkTheme ? "light" : "dark";
		setTheme(nextTheme);
		// toast.success(`Theme changed to ${nextTheme === "dark" ? "Dark" : "Light"}`);
	};

	return (
		<nav
			className={cn(
				"sticky top-0 z-40 border-b backdrop-blur-xl backdrop-saturate-150 transition-all duration-300",
				navClassName,
			)}
		>
			<div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<Link href="/" className={cn("text-2xl font-bold", brandClassName)}>
					<span className="sr-only">Dish Score</span>
					<span aria-hidden>🍽️ Dish Score</span>
				</Link>

				<div className="hidden items-center gap-1 lg:flex">
					{mainItems.map((item) => {
						const active = pathname === item.href;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"rounded-md px-3 py-2 text-sm font-medium transition-colors",
									navItemClassName(active),
								)}
							>
								{formatLabel(item.name)}
							</Link>
						);
					})}
				</div>

				<div className="hidden items-center gap-3 lg:flex">
							<GlobalSearchModal isHomePage={isHomePageStyle} enableShortcut isAuthenticated={isLoggedIn} />
							{isLoggedIn ? <AIChatAssistant /> : null}
							<Button
								variant="ghost"
								size="icon"
								className={themeToggleClassName}
								onClick={handleThemeToggle}
								aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
							>
								{isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
							</Button>
							{isLoggedIn && userInfo ? (
							<NavbarUserDropdown userInfo={userInfo} isHomePage={isHomePageStyle} />
							) : (
								<>
									{authItems[0] && (
										<Button asChild variant="ghost" className={loginButtonClassName}>
											<Link href={authItems[0].href}>{formatLabel(authItems[0].name)}</Link>
										</Button>
									)}
									{authItems[1] && (
										<Button asChild className="btn-neon-primary">
											<Link href={authItems[1].href}>{formatLabel(authItems[1].name)}</Link>
										</Button>
									)}
								</>
							)}
				</div>

				<div className="flex items-center gap-2 lg:hidden">
					<GlobalSearchModal isHomePage={isHomePageStyle} isAuthenticated={isLoggedIn} />
					{isLoggedIn ? <AIChatAssistant className="h-10 w-10 rounded-full px-0 sm:px-4" /> : null}
					<Button
						variant="ghost"
						size="icon"
						className={themeToggleClassName}
						onClick={handleThemeToggle}
						aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
					>
						{isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
					</Button>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className={mobileTriggerClassName}
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Open navigation</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="border-[#32252d] bg-[#0d0a11]/98 text-[#f8f1ec] shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)]">
							<SheetHeader>
								<SheetTitle className="text-left text-xl text-[#f8f1ec]">🍽️ Dish Score</SheetTitle>
							</SheetHeader>

							<div className="mt-6 flex flex-col gap-2">
								{mainItems.map((item) => {
									const active = pathname === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												"rounded-md px-3 py-2 text-sm font-medium transition-colors",
												active
													? "bg-white/12 text-[#ffd7bf]"
													: "text-[#e8dede] hover:bg-white/8 hover:text-white"
											)}
										>
											{formatLabel(item.name)}
										</Link>
									);
								})}
							</div>

							{!isLoggedIn && (
								<div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6">
									{authItems[0] && (
										<Button asChild variant="ghost" className="text-[#efe6e6] hover:bg-white/8 hover:text-white">
											<Link href={authItems[0].href}>{formatLabel(authItems[0].name)}</Link>
										</Button>
									)}
									{authItems[1] && (
										<Button asChild className="btn-neon-primary">
											<Link href={authItems[1].href}>{formatLabel(authItems[1].name)}</Link>
										</Button>
									)}
								</div>
							)}
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
