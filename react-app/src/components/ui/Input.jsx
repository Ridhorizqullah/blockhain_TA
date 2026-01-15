import React from 'react';

export const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: Icon,
    className = '',
    variant = 'user' // 'user' or 'admin'
}) => {
    const isUser = variant === 'user';

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className={`block text-sm font-medium mb-2 ${isUser ? 'text-user-text' : 'text-admin-text'}`}>
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isUser ? 'text-user-muted' : 'text-admin-muted'}`}>
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full rounded-xl py-3 px-4 outline-none transition-all duration-300
                        ${Icon ? 'pl-12' : ''}
                        ${isUser
                            ? 'bg-white border border-user-border text-user-text focus:border-user-primary focus:ring-2 focus:ring-user-primary/20'
                            : 'bg-slate-800 border border-slate-700 text-admin-text focus:border-admin-primary focus:ring-2 focus:ring-admin-primary/20 placeholder-slate-500'
                        }
                    `}
                />
            </div>
        </div>
    );
};
