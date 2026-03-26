"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { HomeNavItems } from "@/routes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export function Navbar() {
	const pathname = usePathname();

	const authItems = HomeNavItems.filter(isAuthItem);
	const mainItems = HomeNavItems.filter((item) => !isAuthItem(item));

	return (
		<nav className="sticky top-0 z-40 border-b border-dark-border bg-dark-card/70 backdrop-blur-md">
			<div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
				<Link href="/" className="text-2xl font-bold text-neon-orange">
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
									active
										? "text-[#FFD700]"
										: "text-[#d6d6d6] hover:text-[#FF5722]"
								)}
							>
								{formatLabel(item.name)}
							</Link>
						);
					})}
				</div>

				<div className="hidden items-center gap-3 lg:flex">
					{authItems[0] && (
						<Button asChild variant="ghost" className="text-foreground hover:text-neon-orange">
							<Link href={authItems[0].href}>{formatLabel(authItems[0].name)}</Link>
						</Button>
					)}
					{authItems[1] && (
						<Button asChild className="btn-neon-primary">
							<Link href={authItems[1].href}>{formatLabel(authItems[1].name)}</Link>
						</Button>
					)}
				</div>

				<div className="lg:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="text-foreground hover:text-neon-orange">
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
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
