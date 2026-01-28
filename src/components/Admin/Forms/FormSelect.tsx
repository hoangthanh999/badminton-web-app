import React from 'react';
import clsx from 'clsx';

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    fullWidth?: boolean;
    options: Array<{ value: string | number; label: string }>;
    placeholder?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
    (
        {
            label,
            error,
            helperText,
            required,
            fullWidth = true,
            options,
            placeholder,
            className,
            id,
            ...props
        },
        ref
    ) => {
        const selectId = id || `select-${label?.replace(/\s+/g, '-').toLowerCase()}`;

        return (
            <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <select
                    ref={ref}
                    id={selectId}
                    className={clsx(
                        'px-3 py-2 border rounded-lg text-sm',
                        'bg-white dark:bg-gray-800',
                        'text-gray-900 dark:text-gray-100',
                        error
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500',
                        'focus:ring-2 focus:outline-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-colors',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${selectId}-error`
                            : helperText
                                ? `${selectId}-helper`
                                : undefined
                    }
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {error && (
                    <p
                        id={`${selectId}-error`}
                        className="text-xs text-red-600 dark:text-red-400"
                    >
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p
                        id={`${selectId}-helper`}
                        className="text-xs text-gray-500 dark:text-gray-400"
                    >
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
