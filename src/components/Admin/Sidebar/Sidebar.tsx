import React from 'react';
import { useSidebarStore } from '@/store/useSidebarStore';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import { menuConfig } from '@/config/menuConfig';
import { useAuth } from '@/contexts/AuthContext';
import clsx from 'clsx';

const Sidebar: React.FC = () => {
    const { isCollapsed } = useSidebarStore();
    const { user } = useAuth();

    // Filter menu items based on permissions
    const visibleMenuItems = menuConfig.filter(
        (item) => !item.requiredRoles || item.requiredRoles.includes(user?.role || '')
    );

    return (
        <aside
            className={clsx(
                'fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 scrollbar-thin overflow-y-auto',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Logo */}
            <SidebarLogo isCollapsed={isCollapsed} />

            {/* Menu Items */}
            <nav className="mt-6 px-3 pb-6 space-y-1">
                {visibleMenuItems.map((item, index) => (
                    <SidebarItem key={item.path || `menu-${index}`} item={item} isCollapsed={isCollapsed} />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
