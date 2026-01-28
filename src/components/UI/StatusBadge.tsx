import React from 'react';
import clsx from 'clsx';

export interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'auto';
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    variant = 'auto',
    className,
}) => {
    const getVariant = () => {
        if (variant === 'default') return 'default';

        // Handle null/undefined status
        if (!status) return 'gray';

        const statusLower = status.toUpperCase();

        // Booking & Order statuses
        if (statusLower === 'PENDING' || statusLower === 'PROCESSING') {
            return 'yellow';
        }
        if (statusLower === 'CONFIRMED' || statusLower === 'PAID') {
            return 'blue';
        }
        if (statusLower === 'COMPLETED' || statusLower === 'DELIVERED' || statusLower === 'SUCCESS') {
            return 'green';
        }
        if (statusLower === 'CANCELLED' || statusLower === 'REJECTED' || statusLower === 'FAILED') {
            return 'red';
        }
        if (statusLower === 'SHIPPED') {
            return 'purple';
        }

        // Product statuses
        if (statusLower === 'ACTIVE' || statusLower === 'AVAILABLE') {
            return 'green';
        }
        if (statusLower === 'INACTIVE' || statusLower === 'MAINTENANCE') {
            return 'gray';
        }
        if (statusLower === 'OUT_OF_STOCK') {
            return 'red';
        }

        return 'gray';
    };

    const badgeVariant = getVariant();

    const variantClasses = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variantClasses[badgeVariant],
                className
            )}
        >
            {status || 'N/A'}
        </span>
    );
};

export default StatusBadge;
