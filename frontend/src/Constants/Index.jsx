//npm install lucide-react
import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: "/admin",
            },
            {
                label: "Analytics",
                icon: ChartColumn,
                path: "/admin/analytics",
            },
            {
                label: "Reports",
                icon: NotepadText,
                path: "/admin/reports",
            },
        ],
    },
    {
        title: "Customers",
        links: [
            {
                label: "Customers",
                icon: Users,
                path: "/admin/customers",
            },
            {
                label: "New customer",
                icon: UserPlus,
                path: "/admin/new-customer",
            },
            {
                label: "Verified customers",
                icon: UserCheck,
                path: "/admin/verified-customers",
            },
        ],
    },
    {
        title: "Products",
        links: [
            {
                label: "Products",
                icon: Package,
                path: "/admin/products",
            },
            {
                label: "New product",
                icon: PackagePlus,
                path: "/admin/new-product",
            },
            {
                label: "Inventory",
                icon: ShoppingBag,
                path: "/admin/inventory",
            },
        ],
    },
    {
        title: "Settings",
        links: [
            {
                label: "Settings",
                icon: Settings,
                path: "/admin/settings",
            },
        ],
    },
];