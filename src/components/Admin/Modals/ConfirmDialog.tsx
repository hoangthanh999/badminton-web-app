import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false,
}) => {
    const handleConfirm = () => {
        onConfirm();
        if (!loading) {
            onClose();
        }
    };

    const variantConfig = {
        danger: {
            icon: XCircle,
            iconColor: 'text-red-600 dark:text-red-500',
            buttonColor: 'bg-red-600 hover:bg-red-700 text-white',
        },
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-yellow-600 dark:text-yellow-500',
            buttonColor: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-600 dark:text-blue-500',
            buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-600 dark:text-green-500',
            buttonColor: 'bg-green-600 hover:bg-green-700 text-white',
        },
    };

    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
            closeOnClickOutside={!loading}
            closeOnEscape={!loading}
        >
            <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Icon className={clsx('w-6 h-6', config.iconColor)} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                            config.buttonColor
                        )}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
