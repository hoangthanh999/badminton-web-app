import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { MenuItem } from '@/config/menuConfig';

interface SidebarItemProps {
    item: MenuItem;
    isCollapsed: boolean;
    level?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed, level = 0 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren && !isCollapsed) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    };

    const ItemContent = (
        <>
            {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" />}
            {!isCollapsed && (
                <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {hasChildren && (
                        <ChevronDown
                            className={clsx(
                                'w-4 h-4 transition-transform',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    )}
                </>
            )}
        </>
    );

    const baseClasses = clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        level > 0 && 'ml-4',
        isCollapsed && 'justify-center'
    );

    if (item.path && !hasChildren) {
        return (
            <NavLink
                to={item.path}
                className={({ isActive }) =>
                    clsx(
                        baseClasses,
                        isActive && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
                        !isActive && 'text-gray-700 dark:text-gray-300'
                    )
                }
                title={isCollapsed ? item.label : undefined}
            >
                {ItemContent}
            </NavLink>
        );
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className={clsx(
                    baseClasses,
                    'w-full text-gray-700 dark:text-gray-300'
                )}
                title={isCollapsed ? item.label : undefined}
            >
                {ItemContent}
            </button>

            {/* Children */}
            {hasChildren && !isCollapsed && isExpanded && (
                <div className="mt-1 space-y-1">
                    {item.children!.map((child, index) => (
                        <SidebarItem
                            key={child.path || `${child.label}-${index}`}
                            item={child}
                            isCollapsed={isCollapsed}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SidebarItem;
