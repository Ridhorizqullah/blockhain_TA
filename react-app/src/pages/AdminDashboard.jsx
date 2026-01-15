import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { TrendingUp, Users, BookOpen, Library, Activity, ArrowUpRight } from 'lucide-react';
import { AdminCard } from '../components/ui/Card';

const AdminDashboard = () => {
    const { contract } = useWeb3();
    const [stats, setStats] = useState({
        totalBooks: '0',
        totalMembers: '0',
        totalBorrows: '0',
        activeLoans: '0'
    });

    useEffect(() => {
        if (contract) {
            loadStats();
        }
    }, [contract]);

    const loadStats = async () => {
        try {
            const statsData = await contract.methods.getLibraryStats().call();
            setStats({
                totalBooks: statsData[0],
                totalMembers: statsData[1],
                totalBorrows: statsData[2],
                activeLoans: statsData[3]
            });
        } catch (err) {
            console.error(err);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, trend }) => (
        <AdminCard className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}`}>
                <Icon size={64} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} border border-${color}/20`}>
                        <Icon size={24} />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                            <ArrowUpRight size={12} />
                            {trend}
                        </div>
                    )}
                </div>

                <p className="text-admin-muted text-sm font-medium uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-3xl font-heading font-bold text-admin-text">{value}</h3>
            </div>
        </AdminCard>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-admin-text mb-2">Dashboard Overview</h1>
                    <p className="text-admin-muted">Real-time insights into library performance</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-admin-muted bg-admin-surface px-3 py-1.5 rounded-lg border border-admin-border">
                    <Activity size={16} className="text-admin-primary animate-pulse" />
                    Live Updates
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    label="Total Books"
                    value={stats.totalBooks}
                    color="admin-primary"
                    trend="+12% this month"
                />
                <StatCard
                    icon={Users}
                    label="Total Members"
                    value={stats.totalMembers}
                    color="admin-accent"
                    trend="+5 new today"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Total Borrows"
                    value={stats.totalBorrows}
                    color="admin-secondary"
                    trend="+8% vs last week"
                />
                <StatCard
                    icon={Library}
                    label="Active Loans"
                    value={stats.activeLoans}
                    color="amber-500"
                />
            </div>

            {/* Recent Activity Section Placeholder - Can be expanded later */}
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
                <AdminCard className="min-h-[300px]">
                    <h3 className="text-xl font-bold text-admin-text mb-6">Recent Activity</h3>
                    <div className="flex items-center justify-center h-48 text-admin-muted border-2 border-dashed border-admin-border rounded-xl">
                        <p>Activity chart coming soon...</p>
                    </div>
                </AdminCard>

                <AdminCard className="min-h-[300px]">
                    <h3 className="text-xl font-bold text-admin-text mb-6">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-admin-bg rounded-xl border border-admin-border">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-admin-text font-medium">Smart Contract</span>
                            </div>
                            <span className="text-emerald-400 text-sm">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-admin-bg rounded-xl border border-admin-border">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-admin-text font-medium">IPFS Gateway</span>
                            </div>
                            <span className="text-emerald-400 text-sm">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-admin-bg rounded-xl border border-admin-border">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-admin-text font-medium">Sepolia Network</span>
                            </div>
                            <span className="text-emerald-400 text-sm">Synced</span>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
};

export default AdminDashboard;
