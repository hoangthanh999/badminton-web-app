import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth = false, icon, className = '', ...props }, ref) => {
        const containerClasses = ['input-container', fullWidth ? 'input-full' : '', className]
            .filter(Boolean)
            .join(' ');

        const inputClasses = ['input', error ? 'input-error' : '', icon ? 'input-with-icon' : '']
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label className="input-label" htmlFor={props.id}>
                        {label}
                        {props.required && <span className="input-required">*</span>}
                    </label>
                )}
                <div className="input-wrapper">
                    {icon && <div className="input-icon">{icon}</div>}
                    <input ref={ref} className={inputClasses} {...props} />
                </div>
                {error && <span className="input-error-text">{error}</span>}
                {helperText && !error && <span className="input-helper-text">{helperText}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
