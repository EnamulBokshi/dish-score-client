"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";

import { HomeNavItems } from "@/routes";
import { cn } from "@/lib/utils";
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
	const [mobileOpen, setMobileOpen] = useState(false);
	const isLoggedIn = Boolean(userInfo?.id);

	const authItems = HomeNavItems.filter(isAuthItem);
	const mainItems = HomeNavItems.filter((item) => !isAuthItem(item));

	return (
		<header className="sticky top-0 z-40" style={{ fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}>
			{/* Win2K title bar gradient strip */}
			<div
				className="win-titlebar flex items-center gap-2 px-3 py-1 select-none"
				style={{ background: "linear-gradient(to right, #0a246a 0%, #4872c4 60%, #a0b8d8 100%)" }}
			>
				<span className="text-[13px]" aria-hidden>🍽️</span>
				<span className="font-bold text-[12px] text-white tracking-wide">Dish Score - Microsoft Internet Explorer</span>
				<span className="ml-auto flex gap-1">
					{["_", "□", "✕"].map((c) => (
						<span
							key={c}
							className="inline-flex h-[18px] w-[18px] items-center justify-center text-[10px] font-bold text-black cursor-pointer select-none"
							style={{
								background: "#d4d0c8",
								borderTop: "2px solid #ffffff",
								borderLeft: "2px solid #ffffff",
								borderRight: "2px solid #404040",
								borderBottom: "2px solid #404040",
							}}
							aria-hidden
						>
							{c}
						</span>
					))}
				</span>
			</div>

			{/* Classic menu bar */}
			<div
				style={{
					background: "#d4d0c8",
					borderBottom: "2px solid #808080",
					fontFamily: "'Tahoma','Verdana','Arial',sans-serif",
					fontSize: "11px",
				}}
			>
				{/* Address / toolbar row */}
				<div className="flex items-center gap-2 px-2 py-1 border-b border-[#808080]">
					<Link href="/" className="font-bold text-[12px] text-[#0a246a] mr-2 whitespace-nowrap">
						<span className="sr-only">Dish Score</span>
						<span aria-hidden>🍽️ Dish Score</span>
					</Link>

					{/* Separator */}
					<div className="h-5 w-px bg-[#808080] mx-1" aria-hidden />

					{/* Nav links as menu items */}
					<nav className="hidden lg:flex items-center gap-0" aria-label="Main navigation">
						{mainItems.map((item) => {
							const active = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"px-3 py-1 text-[11px] text-black cursor-pointer select-none",
										active
											? "bg-[#0a246a] text-white"
											: "hover:bg-[#0a246a] hover:text-white",
									)}
								>
									<u className="underline">{formatLabel(item.name).charAt(0)}</u>
									{formatLabel(item.name).slice(1)}
								</Link>
							);
						})}
					</nav>

					<div className="ml-auto flex items-center gap-2">
						<GlobalSearchModal isHomePage={false} enableShortcut />
						{isLoggedIn && userInfo ? (
							<NavbarUserDropdown userInfo={userInfo} />
						) : (
							<div className="hidden lg:flex items-center gap-2">
								{authItems[0] && (
									<Link
										href={authItems[0].href}
										className="btn-win px-3 py-0.5 text-[11px] text-black"
									>
										{formatLabel(authItems[0].name)}
									</Link>
								)}
								{authItems[1] && (
									<Link
										href={authItems[1].href}
										className="btn-win-primary px-3 py-0.5 text-[11px] text-black font-bold"
										style={{
											background: "#d4d0c8",
											border: "1px solid #000000",
											borderTop: "2px solid #ffffff",
											borderLeft: "2px solid #ffffff",
											borderRight: "2px solid #404040",
											borderBottom: "2px solid #404040",
											boxShadow: "inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080",
										}}
									>
										{formatLabel(authItems[1].name)}
									</Link>
								)}
							</div>
						)}

						{/* Mobile hamburger */}
						<div className="lg:hidden">
							<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
								<SheetTrigger asChild>
									<button className="btn-win p-1" aria-label="Open navigation">
										<Menu className="h-4 w-4" />
									</button>
								</SheetTrigger>
								<SheetContent
									side="right"
									style={{
										background: "#d4d0c8",
										fontFamily: "'Tahoma','Verdana',sans-serif",
										fontSize: "11px",
										borderLeft: "2px solid #808080",
									}}
								>
									<SheetHeader>
										<SheetTitle className="text-left text-[13px] font-bold text-[#0a246a]">🍽️ Dish Score</SheetTitle>
									</SheetHeader>
									<div className="mt-4 flex flex-col gap-1">
										{mainItems.map((item) => {
											const active = pathname === item.href;
											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() => setMobileOpen(false)}
													className={cn(
														"block px-3 py-1.5 text-[11px]",
														active ? "bg-[#0a246a] text-white" : "text-black hover:bg-[#0a246a] hover:text-white",
													)}
												>
													{formatLabel(item.name)}
												</Link>
											);
										})}
									</div>
									{!isLoggedIn && (
										<div className="mt-4 flex flex-col gap-2 pt-3" style={{ borderTop: "1px solid #808080" }}>
											{authItems[0] && (
												<Link href={authItems[0].href} className="btn-win block text-center text-[11px]">
													{formatLabel(authItems[0].name)}
												</Link>
											)}
											{authItems[1] && (
												<Link href={authItems[1].href} className="btn-win-primary block text-center text-[11px] font-bold">
													{formatLabel(authItems[1].name)}
												</Link>
											)}
										</div>
									)}
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>

				{/* Status / marquee bar */}
				<div
					className="overflow-hidden px-2 py-0.5 text-[10px] text-[#000080]"
					style={{ background: "#ece9d8", borderBottom: "1px solid #aca899" }}
				>
					<div className="win-marquee inline-block">
						&#9733; Welcome to Dish Score! The hottest dishes, ranked by real diners. &#x2022;
						Browse trending dishes, top restaurants, and community reviews. &#x2022;
						Sign up FREE today! &#x2022; &nbsp;&nbsp;&nbsp;
						&#9733; Welcome to Dish Score! The hottest dishes, ranked by real diners. &#x2022;
						Browse trending dishes, top restaurants, and community reviews. &#x2022;
						Sign up FREE today!
					</div>
				</div>
			</div>
		</header>
	);
}
