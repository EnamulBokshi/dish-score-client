
import DashboardNavbar from '@/components/layout/DashboardNavbar'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import React from 'react'

export default async function RootDashboardLayout({children}:{children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen overflow-hidden">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
            {/* Dashboard Navbar */}
            <DashboardNavbar />

            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                <div>
                {children}
                    </div>

            </main>
        </div>
    </div>
  )
}
