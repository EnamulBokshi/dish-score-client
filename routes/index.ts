import { getDefaultDashboardRoute } from "@/lib/routeUtils";
import { NavSection } from "@/types/dashboard.type";
import { UserRole } from "@/types/enums";

export const HomeNavItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Restaurants",
        href: "/restaurants",
    },
    {
        name: "Dishes",
        href: "/dishes",
    },
    {
        name: "Reviews",
        href: "/reviews",
    },
    {
        name: "About",
        href: "/about",
    },  
    {
        name: "Contact",
        href: "/contact",
    },
    {
        name: "login",
        href: "/login",
    },
    {
        name: "signup",
        href: "/signup",
    }
];

export const getCommonNavItems = (role:UserRole):NavSection[] => {
 const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items: [
                {
                    label: "Home",
                    href: "/",
                    icon: "Home"
                },
                {
                    label: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard"
                },
                {
                    label: "My Profile",
                    href: "/my-profile",
                    icon: "User"
                },
                
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    label: "Change Password",
                    href: "/change-password",
                    icon: "Lock"
                },
                {
                    label: "Logout",
                    href: "/logout",
                    icon: "Logout"
                },

            ]

        }
    ]
}


export const ownerNavItems: NavSection[] = [
    {
        title: "Management",
        items: [
            {
                label: "Dashboard",
                href: "/owner/dashboard",
                icon: "LayoutDashboard"
            },
            {
                label: "My Profile",
                href: "/my-profile",
                icon: "User"
            },
            {
                label: "Restaurants",
                href: "/owner/restaurants",
                icon: "Store"
            },
            {
                label: "Dishes",
                href: "/owner/dishes",
                icon: "Pizza"
            },
            {
                label: "Reviews",
                href: "/owner/reviews",
                icon: "Star"
            },
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "Admin Panel",
        items: [
            {
                label: "Dashboard",
                href: "/admin/dashboard",
                icon: "LayoutDashboard"
            },
            {
                label: "User Management",
                href: "/admin/users",
                icon: "Users"
            },
            {
                label: "Restaurant Management",
                href: "/admin/restaurants",
                icon: "Store"
            },
            {
                label: "Dish Management",
                href: "/admin/dishes",
                icon: "Pizza"
            },
            {
                label: "Review Management",
                href: "/admin/reviews",
                icon: "Star"
            },
        ]
    }
]

export const consumerNavItems: NavSection[] = [
    {
        title: "Review Management",
        items: [
            
            {
                label: "My Reviews",
                href: "/dashboard/my-reviews",
                icon: "Star"
            },
            {
                label: "Review Stats",
                href: "/dashboard/review-stats",
                icon: "BarChart2"
            }
        ]   

    },
    {
        title: "Restaurant Discovery",
        items: [
            {
                label: "Restaurants",
                href: "/dashboard/restaurants",
                icon: "Store"
            },
            {
                label: "Dishes",
                href: "/dashboard/dishes",
                icon: "Pizza"
            }
        ]
    }
    
]


export const navItemsByRole = (role: UserRole): NavSection[] => {
    role = role === UserRole.SUPER_ADMIN? UserRole.ADMIN : role;
    const commonItems = getCommonNavItems(role);
    console.log("Common Items:", commonItems);
    console.log("Role:", role);
    switch (role){
        case UserRole.ADMIN: 
            return [...commonItems, ...adminNavItems];
        case UserRole.OWNER:
            return [...commonItems, ...ownerNavItems];
        case UserRole.CONSUMER:
            return [...commonItems, ...consumerNavItems];
        default:
            return commonItems;
    }
}