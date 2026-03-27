import { getDefaultDashboardRoute } from "@/lib/routeUtils";
import { navItemsByRole } from "@/routes";
import { getUserInfo } from "@/services/auth.services";
import { NavSection } from "@/types/dashboard.type";
import DashboardNavbarContent from "./DashboardNavbarContent";

async function DashboardNavbar() {
    const userInfo = await getUserInfo();
    const navItems: NavSection[] = navItemsByRole(userInfo?.role);
  
    const dashboardHome = getDefaultDashboardRoute(userInfo?.role);
  
  return (
    <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
  )
}

export default DashboardNavbar