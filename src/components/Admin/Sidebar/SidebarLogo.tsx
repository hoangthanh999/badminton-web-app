import React from 'react';

interface SidebarLogoProps {
    isCollapsed: boolean;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ isCollapsed }) => {
    return (
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 px-4">
            <div className="flex items-center gap-3">
                {/* Logo Icon */}
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">🏸</span>
                </div>

                {/* Logo Text */}
                {!isCollapsed && (
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            Badminton
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Admin Panel
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarLogo;
