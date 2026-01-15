import React from 'react';
import NavbarUser from './NavbarUser';

const LayoutUser = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-50 text-user-text font-sans">
            <NavbarUser />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default LayoutUser;
