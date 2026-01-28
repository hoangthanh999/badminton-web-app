import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    BarChart3,
    Settings,
    Calendar,
    MapPin,
    ListOrdered,
    FolderKanban,
    Star,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
    label: string;
    icon?: LucideIcon;
    path?: string;
    requiredRoles?: string[];
    children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/admin',
        requiredRoles: ['ADMIN', 'OWNER'],
    },
    {
        label: 'Bookings',
        icon: Calendar,
        path: '/admin/bookings',
        requiredRoles: ['ADMIN', 'OWNER'],
    },
    {
        label: 'Courts',
        icon: MapPin,
        requiredRoles: ['ADMIN', 'OWNER'],
        children: [
            {
                label: 'All Courts',
                path: '/admin/courts',
            },
            {
                label: 'Create Court',
                path: '/admin/courts/create',
            },
        ],
    },
    {
        label: 'Shop Management',
        icon: ShoppingCart,
        requiredRoles: ['ADMIN'],
        children: [
            {
                label: 'Products',
                icon: Package,
                path: '/admin/products',
            },
            {
                label: 'Orders',
                icon: ListOrdered,
                path: '/admin/orders',
            },
            {
                label: 'Categories',
                icon: FolderKanban,
                path: '/admin/categories',
            },
            {
                label: 'Reviews',
                icon: Star,
                path: '/admin/reviews',
            },
        ],
    },
    {
        label: 'Users',
        icon: Users,
        path: '/admin/users',
        requiredRoles: ['ADMIN'],
    },
    {
        label: 'Reports',
        icon: BarChart3,
        path: '/admin/reports',
        requiredRoles: ['ADMIN', 'OWNER'],
    },
    {
        label: 'Settings',
        icon: Settings,
        path: '/admin/settings',
        requiredRoles: ['ADMIN'],
    },
];
