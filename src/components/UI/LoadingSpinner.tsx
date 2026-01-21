import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color,
    fullScreen = false,
}) => {
    const spinnerClasses = ['spinner', `spinner-${size}`].filter(Boolean).join(' ');

    const spinnerStyle = color ? { borderTopColor: color, borderRightColor: color } : {};

    if (fullScreen) {
        return (
            <div className="spinner-fullscreen">
                <div className={spinnerClasses} style={spinnerStyle}></div>
                <p className="spinner-text">Đang tải...</p>
            </div>
        );
    }

    return <div className={spinnerClasses} style={spinnerStyle}></div>;
};

export default LoadingSpinner;
