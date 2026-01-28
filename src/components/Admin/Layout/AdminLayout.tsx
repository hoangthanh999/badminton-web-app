import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import AdminHeader from '../Header/AdminHeader';
import Breadcrumb from './Breadcrumb';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Toaster } from 'react-hot-toast';

const AdminLayout: React.FC = () => {
    const { isCollapsed } = useSidebarStore();
    const { isDarkMode, setDarkMode } = useThemeStore();

    useEffect(() => {
        // Apply theme on mount from stored preference
        const stored = localStorage.getItem('theme-storage');
        if (stored) {
            try {
                const { state } = JSON.parse(stored);
                if (state?.isDarkMode) {
                    setDarkMode(true);
                }
            } catch (e) {
                console.error('Failed to parse theme storage', e);
            }
        }
    }, [setDarkMode]);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {/* Header */}
                <AdminHeader />

                {/* Breadcrumb */}
                <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <Breadcrumb />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: isDarkMode ? '#1f2937' : '#ffffff',
                        color: isDarkMode ? '#f9fafb' : '#111827',
                    },
                }}
            />
        </div>
    );
};

export default AdminLayout;
