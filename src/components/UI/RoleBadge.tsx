import React from 'react';
import clsx from 'clsx';
import { User, Shield, Crown } from 'lucide-react';

export interface RoleBadgeProps {
    role: string;
    className?: string;
    showIcon?: boolean;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({
    role,
    className,
    showIcon = true,
}) => {
    const getRoleConfig = () => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return {
                    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                    icon: Shield,
                };
            case 'OWNER':
                return {
                    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
                    icon: Crown,
                };
            case 'USER':
            default:
                return {
                    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                    icon: User,
                };
        }
    };

    const config = getRoleConfig();
    const Icon = config.icon;

    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                config.color,
                className
            )}
        >
            {showIcon && <Icon className="w-3.5 h-3.5" />}
            {role}
        </span>
    );
};

export default RoleBadge;
