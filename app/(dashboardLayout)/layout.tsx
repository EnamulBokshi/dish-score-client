
import DashboardNavbar from '@/components/layout/DashboardNavbar'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import React from 'react'

export default async function RootDashboardLayout({children}:{children: React.ReactNode}) {
  return (
  <div className="min-h-screen bg-background text-foreground md:pl-(--dashboard-sidebar-width,16rem)">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
    <div className="flex min-h-screen flex-col">
            {/* Dashboard Navbar */}
            <DashboardNavbar />

            {/* Dashboard Content */}
        <main className="flex-1 bg-muted/20 p-4 md:p-6 dark:bg-muted/10">
                <div>
                {children}
                    </div>

            </main>
        </div>
    </div>
  )
}
