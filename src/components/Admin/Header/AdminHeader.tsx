import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useThemeStore } from '@/store/useThemeStore';
import UserMenu from './UserMenu';
import Notifications from './Notifications';

const AdminHeader: React.FC = () => {
    const { toggleSidebar } = useSidebarStore();
    const { isDarkMode, toggleTheme } = useThemeStore();

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left: Toggle Sidebar */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <Notifications />

                    {/* User Menu */}
                    <UserMenu />
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
