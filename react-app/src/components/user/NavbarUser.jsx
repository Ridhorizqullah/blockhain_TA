import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import { BookOpen, History, UserPlus, Wallet, BookMarked, Menu, X } from 'lucide-react';
import logo from '../../assets/logo.jpg';
import { Button } from '../ui/Button';

const NavbarUser = () => {
    const { account, connectWallet, disconnectWallet, isMember } = useWeb3();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${isActive(to)
                ? 'bg-gradient-to-r from-user-primary to-user-secondary text-white shadow-md shadow-user-primary/20'
                : 'text-user-muted hover:text-user-primary hover:bg-user-primary/5'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-user-primary to-user-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            <img
                                src={logo}
                                alt="SmartLib Logo"
                                className="relative w-10 h-10 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <span className="font-heading font-bold text-2xl text-user-text tracking-tight">
                            Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-user-primary to-user-secondary">Lib</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {account && (
                        <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-white/20 shadow-sm">
                            <NavLink to="/books" icon={BookOpen} label="Browse Books" />
                            {!isMember && <NavLink to="/register" icon={UserPlus} label="Register" />}
                            {isMember && <NavLink to="/my-borrow" icon={BookMarked} label="My Borrow" />}
                            {isMember && <NavLink to="/my-history" icon={History} label="History" />}
                        </div>
                    )}

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {account ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 shadow-sm">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <div className="absolute -inset-1 bg-emerald-500 rounded-full blur opacity-25 animate-pulse"></div>
                                    </div>
                                    <span className="text-sm font-semibold text-user-text font-mono">
                                        {account.substring(0, 6)}...{account.substring(38)}
                                    </span>
                                </div>
                                <Button
                                    variant="danger"
                                    onClick={disconnectWallet}
                                    className="!py-2 !px-4 !text-xs"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={connectWallet}>
                                <Wallet size={18} />
                                Connect Wallet
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-user-text hover:bg-user-bg transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-user-border bg-white/95 backdrop-blur-xl absolute w-full left-0 shadow-xl animate-in slide-in-from-top-5">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {account && (
                            <>
                                <Link to="/books" className="block px-4 py-3 rounded-xl hover:bg-user-bg text-user-text font-medium">Browse Books</Link>
                                {!isMember && <Link to="/register" className="block px-4 py-3 rounded-xl hover:bg-user-bg text-user-text font-medium">Register</Link>}
                                {isMember && <Link to="/my-borrow" className="block px-4 py-3 rounded-xl hover:bg-user-bg text-user-text font-medium">My Borrow</Link>}
                                {isMember && <Link to="/my-history" className="block px-4 py-3 rounded-xl hover:bg-user-bg text-user-text font-medium">History</Link>}
                                <div className="h-px bg-user-border my-2"></div>
                            </>
                        )}
                        <div className="px-4">
                            {account ? (
                                <Button variant="danger" onClick={disconnectWallet} className="w-full justify-center">Logout</Button>
                            ) : (
                                <Button onClick={connectWallet} className="w-full justify-center">Connect Wallet</Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavbarUser;
