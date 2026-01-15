import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import logo from '../../assets/logo.jpg';
import { Button } from '../ui/Button';
import { LayoutDashboard, Book, History, Menu, X } from 'lucide-react';

const NavbarAdmin = () => {
    const { account, disconnectWallet } = useWeb3();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${isActive(to)
                ? 'bg-admin-primary/10 text-admin-primary border border-admin-primary/20'
                : 'text-admin-muted hover:text-admin-text hover:bg-white/5'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );

    return (
        <nav className="glass-dark sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/admin" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-admin-primary to-admin-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            <img
                                src={logo}
                                alt="SmartLib Logo"
                                className="relative w-9 h-9 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <span className="font-heading font-bold text-xl text-admin-text tracking-wide">
                            ADMIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-admin-primary to-admin-secondary">PANEL</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-xl border border-white/5">
                        <NavLink to="/admin" icon={LayoutDashboard} label="Dashboard" />
                        <NavLink to="/admin/books" icon={Book} label="Manage Books" />
                        <NavLink to="/admin/history" icon={History} label="History Logs" />
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-800/50 border border-white/10 rounded-full px-4 py-2">
                            <div className="relative">
                                <div className="w-2 h-2 rounded-full bg-admin-accent animate-pulse"></div>
                                <div className="absolute -inset-1 bg-admin-accent rounded-full blur opacity-25 animate-pulse"></div>
                            </div>
                            <span className="text-xs font-mono text-admin-text">
                                {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Not Connected'}
                            </span>
                            <span className="bg-admin-primary/20 text-admin-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-admin-primary/20">
                                ADMIN
                            </span>
                        </div>
                        {account && (
                            <Button
                                variant="danger"
                                onClick={disconnectWallet}
                                className="!py-2 !px-4 !text-xs"
                            >
                                Logout
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-admin-text hover:bg-white/5 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl absolute w-full left-0 shadow-xl animate-in slide-in-from-top-5">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-admin-text font-medium">
                            <LayoutDashboard size={20} /> Dashboard
                        </Link>
                        <Link to="/admin/books" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-admin-text font-medium">
                            <Book size={20} /> Manage Books
                        </Link>
                        <Link to="/admin/history" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-admin-text font-medium">
                            <History size={20} /> History Logs
                        </Link>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="px-4">
                            <Button variant="danger" onClick={disconnectWallet} className="w-full justify-center">Logout</Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarAdmin;
