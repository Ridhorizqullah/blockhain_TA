import React from 'react';

export const Card = ({ children, className = '', hover = true }) => {
    return (
        <div className={`
            bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6
            transition-all duration-300 ease-out
            ${hover ? 'hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-user-primary/30' : ''}
            ${className}
        `}>
            {children}
        </div>
    );
};

export const AdminCard = ({ children, className = '', hover = true }) => {
    return (
        <div className={`
            bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl p-6
            transition-all duration-300 ease-out
            ${hover ? 'hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-admin-primary/30' : ''}
            ${className}
        `}>
            {children}
        </div>
    );
};
