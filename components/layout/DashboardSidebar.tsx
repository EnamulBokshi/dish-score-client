import { getUserInfo } from "@/services/auth.services";
import { NavSection } from "@/types/dashboard.type";
import DashbordSidebarContent from "./DashboardSidebarContent";
import { getDefaultDashboardRoute } from "@/lib/routeUtils";
import { navItemsByRole } from "@/routes";


 const DashboardSidebar = async() => {

  const userInfo = await getUserInfo();
  const navItems: NavSection[] = navItemsByRole(userInfo?.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role);

  return (
    <DashbordSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>
  )
}


export default DashboardSidebar;
