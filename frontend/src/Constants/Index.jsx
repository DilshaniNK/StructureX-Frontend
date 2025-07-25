//npm install lucide-react
import { Bell, BellDot, Book, ChartColumn, HelpingHand, Home, NewspaperIcon, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserCircleIcon, UserPlus, Users } from "lucide-react";
import ProfileImage from "../assets/ProfileImage.jpg";
import ProductImage from "../assets/ProductImage.jpg"
import { Helpers } from "react-scroll";
import { useParams } from "react-router-dom";



export const navbarLinks = (adminId)=>[

    
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                icon: Home,
                path: `/admin/${adminId}`,
            },
            {
                label: "Analytics",
                icon: ChartColumn,
                path: `/admin/${adminId}/analytics`,
            },
            {
                label: "Reports",
                icon: NotepadText,
                path: `/admin/${adminId}/reports`,
            },
        ],
    },
    {
        title: "Employees",
        links: [
            {
                label: "Employees",
                icon: Users,
                path: `/admin/${adminId}/employees`,
            },
            {
                label: "Add Employee",
                icon: UserPlus,
                path: `/admin/${adminId}/add-employee`,
            },
            // {
            //     label: "Verified customers",
            //     icon: UserCheck,
            //     path: "/admin/verified-customers",
            // },
        ],
    },
    {
        title: "Suppliers",
        links: [
            {
                label: "Add Supplier",
                icon: UserPlus,
                path: `/admin/${adminId}/add-supplier`,
            },
        ],
    },
    {
        title: "Projects",
        links: [
            {
                label: "Project Overview",
                icon: Package,
                path: `/admin/${adminId}/projects`,
            },
            // {
            //     label: "New product",
            //     icon: PackagePlus,
            //     path: "/admin/new-product",
            // },
            // {
            //     label: "Inventory",
            //     icon: ShoppingBag,
            //     path: "/admin/inventory",
            // },
        ],
    },
    {
        title: "Profile",
        links: [
            {
                label: "Profile",
                icon: UserCircleIcon,
                path: `/admin/${adminId}/profile`, 
            },
        ],
    },
    {
        title: "System",
        links: [
            {
                label: "Publish Projects",
                icon: NewspaperIcon,
                path: `/admin/${adminId}/publish`,  
            },
        ],
    },
    {
        title: "Support",
        links: [
            {
                label: "Contact Support",
                icon: HelpingHand,
                path: `/admin/${adminId}/contact-support`,  
            },
        ],
    },
    {
        title: "Notification",
        links: [
            {
                label: "Notification",
                icon: BellDot,
                path: `/admin/${adminId}/notification`,  
            },
        ],
    },
];

export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];
