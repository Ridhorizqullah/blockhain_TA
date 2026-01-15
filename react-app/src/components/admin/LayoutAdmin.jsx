import React from 'react';
import NavbarAdmin from './NavbarAdmin';

const LayoutAdmin = ({ children }) => {
    return (
        <div className="min-h-screen bg-admin-bg text-admin-text font-sans">
            <NavbarAdmin />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default LayoutAdmin;
