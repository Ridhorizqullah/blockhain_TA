import React from 'react';

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    type = 'button'
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-user-primary to-user-secondary text-white shadow-lg shadow-user-primary/30 hover:shadow-user-primary/50',
        secondary: 'bg-white text-user-text border border-user-border hover:bg-user-bg',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30',
        ghost: 'text-user-muted hover:text-user-primary hover:bg-user-primary/5',

        // Admin variants
        adminPrimary: 'bg-gradient-to-r from-admin-primary to-admin-secondary text-white shadow-lg shadow-admin-primary/30 hover:shadow-admin-primary/50',
        adminSecondary: 'bg-slate-800 text-admin-text border border-slate-700 hover:bg-slate-700',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300
                active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </button>
    );
};
