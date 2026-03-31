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
                // {
                //     label: "My Profile",
                //     href: "/my-profile",
                //     icon: "User"
                // },
                
            ]
        },
        
    ]
}


export const ownerNavItems: NavSection[] = [
    {
        title: "Restaurant Management",
        items: [
         
            {
                label: "Restaurants",
                href: "/owner/dashboard/restaurants",
                icon: "Store"
            },
            {
                label: "Dishes",
                href: "/owner/dashboard/dishes",
                icon: "Pizza"
            },
           
        ]
    }
]

export const adminNavItems: NavSection[] = [
    {
        title: "Users Management",
        items: [
            
            {
                label: "Users",
                href: "/admin/dashboard/users",
                icon: "Users"
            },
        ]
        },
        {
            title: "Restaurant Management",
            items: [
            {
                label: "Restaurant",
                href: "/admin/dashboard/restaurants",
                icon: "Store"
            },
            {
                label: "Dish",
                href: "/admin/dashboard/dishes",
                icon: "Pizza"
            },
            
        ]
    }, 
    {
        title: "Review Management",
        items: [
            {
                label: "Reviews",
                href: "/admin/reviews",
                icon: "Star"
            },
            
        ]
    },

    {
        title: "Contact Management",
        items: [
            {
                label: "Contacts",
                href: "/admin/dashboard/contacts",
                icon: "MessageSquareText"
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
            // {
            //     label: "Review Stats",
            //     href: "/dashboard/review-stats",
            //     icon: "BarChart2"
            // }
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