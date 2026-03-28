
import DashboardNavbar from '@/components/layout/DashboardNavbar'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import React from 'react'

export default async function RootDashboardLayout({children}:{children: React.ReactNode}) {
  return (
  <div className="min-h-screen md:pl-(--dashboard-sidebar-width,16rem)">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
    <div className="flex min-h-screen flex-col">
            {/* Dashboard Navbar */}
            <DashboardNavbar />

            {/* Dashboard Content */}
      <main className="flex-1 bg-muted/10 p-4 md:p-6">
                <div>
                {children}
                    </div>

            </main>
        </div>
    </div>
  )
}
