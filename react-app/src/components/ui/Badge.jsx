import React from 'react';

export const Badge = ({ children, variant = 'success', className = '' }) => {
    const variants = {
        success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-100 text-amber-700 border-amber-200',
        error: 'bg-red-100 text-red-700 border-red-200',
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',

        // Admin dark mode variants
        adminSuccess: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        adminWarning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        adminError: 'bg-red-500/10 text-red-400 border-red-500/20',
        adminInfo: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };

    return (
        <span className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${variants[variant]}
            ${className}
        `}>
            {children}
        </span>
    );
};
