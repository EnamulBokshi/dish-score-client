import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import DashboardSidebarContent from "@/components/layout/DashboardSidebarContent";
import GuestDashboardNavbar from "@/components/layout/GuestDashboardNavbar";
import { Button } from "@/components/ui/button";
import { guestDashboardNavSections, guestDashboardUserInfo } from "@/lib/guestDashboardData";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground md:pl-(--dashboard-sidebar-width,16rem)">
			<DashboardSidebarContent
				userInfo={guestDashboardUserInfo}
				navItems={guestDashboardNavSections}
				dashboardHome="/guest-dashboard"
			/>
			<div className="flex min-h-screen flex-col">
				<GuestDashboardNavbar
					userInfo={guestDashboardUserInfo}
					navItems={guestDashboardNavSections}
					dashboardHome="/guest-dashboard"
				/>
				<div className="border-b border-dashed border-[#ddc8ba] bg-[#fff6ef] px-4 py-3 text-[#6a4b40] dark:border-white/10 dark:bg-white/5 dark:text-[#e9dfd7] md:px-6">
					<div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-start gap-3">
							<span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffe7d5] text-[#a95f2e] dark:bg-neon-orange/10 dark:text-neon-gold">
								<Sparkles className="h-4 w-4" />
							</span>
							<div className="space-y-1">
								<p className="text-sm font-semibold text-[#3a2720] dark:text-white">Guest demo mode is active</p>
								<p className="text-sm leading-6 text-[#6f5c51] dark:text-[#bbb4be]">
									You’re exploring a full consumer-style dashboard with dummy data. Sign in anytime to switch to your personal account.
								</p>
							</div>
						</div>

						<Button asChild className="btn-neon-primary h-10 rounded-full px-5">
							<Link href="/login">Sign In</Link>
						</Button>
					</div>
				</div>
				<main className="flex-1 bg-muted/20 p-4 md:p-6 dark:bg-muted/10">{children}</main>
			</div>
		</div>
	);
}