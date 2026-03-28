"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { HomeNavItems } from "@/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/layout/UserDropdown";
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
	const [isScrolled, setIsScrolled] = useState(false);
	const isHomePage = pathname === "/";
	const isLoggedIn = Boolean(userInfo?.id);

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

	const navClassName = isHomePage
		? isScrolled
			? "border-[#32252d] bg-[#0d0a11]/72 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.7)]"
			: "border-[#271b24] bg-[#08060c]/45 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.6)]"
		: isScrolled
			? "border-[#d9cbc4] bg-[#f7f0eb]/94 shadow-[0_14px_30px_-20px_rgba(54,38,31,0.52)]"
			: "border-[#e4d8d1] bg-[#f8f3ef]/84 shadow-[0_10px_30px_-22px_rgba(54,38,31,0.4)]";

	const brandClassName = isHomePage ? "text-[#f8f1ec]" : "text-[#6a4b40]";

	const navItemClassName = (active: boolean) => {
		if (isHomePage) {
			return active
				? "bg-white/12 text-[#ffd7bf]"
				: "text-[#e8dede] hover:bg-white/8 hover:text-white";
		}

		return active
			? "bg-[#efe4df] text-[#9c4f3a]"
			: "text-[#594b45] hover:bg-[#f1e8e3] hover:text-[#b5553b]";
	};

	const loginButtonClassName = isHomePage
		? "text-[#efe6e6] hover:bg-white/8 hover:text-white"
		: "text-[#4f433e] hover:bg-[#f1e8e3] hover:text-[#b5553b]";

	const mobileTriggerClassName = isHomePage
		? "text-[#efe6e6] hover:bg-white/8 hover:text-white"
		: "text-[#4f433e] hover:bg-[#f1e8e3] hover:text-[#b5553b]";

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
							{isLoggedIn && userInfo ? (
								<UserDropdown userInfo={userInfo} />
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

				<div className="lg:hidden">
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
						<SheetContent side="right" className="border-dark-border bg-dark-card text-foreground">
							<SheetHeader>
								<SheetTitle className="text-left text-xl text-neon-orange">🍽️ Dish Score</SheetTitle>
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
													? "bg-[#FF5722]/10 text-[#FFD700]"
													: "text-[#d6d6d6] hover:bg-[#FF5722]/10 hover:text-[#FF5722]"
											)}
										>
											{formatLabel(item.name)}
										</Link>
									);
								})}
							</div>

							{!isLoggedIn && (
								<div className="mt-6 flex flex-col gap-2 border-t border-dark-border pt-6">
									{authItems[0] && (
										<Button asChild variant="outline" className="btn-outline-neon">
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
