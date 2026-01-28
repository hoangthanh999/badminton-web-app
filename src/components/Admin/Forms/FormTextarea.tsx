import React from 'react';
import clsx from 'clsx';

export interface FormTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    fullWidth?: boolean;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    (
        {
            label,
            error,
            helperText,
            required,
            fullWidth = true,
            className,
            id,
            rows = 4,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${label?.replace(/\s+/g, '-').toLowerCase()}`;

        return (
            <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    className={clsx(
                        'px-3 py-2 border rounded-lg text-sm',
                        'bg-white dark:bg-gray-800',
                        'text-gray-900 dark:text-gray-100',
                        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        error
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500',
                        'focus:ring-2 focus:outline-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-colors',
                        'resize-none',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${textareaId}-error`
                            : helperText
                                ? `${textareaId}-helper`
                                : undefined
                    }
                    {...props}
                />

                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="text-xs text-red-600 dark:text-red-400"
                    >
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p
                        id={`${textareaId}-helper`}
                        className="text-xs text-gray-500 dark:text-gray-400"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
