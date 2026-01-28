import React from 'react';
import { LucideIcon, FileX } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No Data Available',
    message = 'There is no data to display at this time.',
    icon: Icon = FileX,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                {message}
            </p>

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
