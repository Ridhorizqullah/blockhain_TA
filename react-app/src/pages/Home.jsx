import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { BookOpen, Shield, Zap, ArrowRight, Wallet } from 'lucide-react';
import logo from '../assets/logo.jpg';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const Home = () => {
    const { account, connectWallet, isAdmin } = useWeb3();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (account) {
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/books');
            }
        }
    }, [account, isAdmin, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-50 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-user-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-user-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-user-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Hero Text */}
                    <div className="text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-user-border backdrop-blur-sm shadow-sm animate-in slide-in-from-bottom-5 fade-in duration-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-user-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-user-primary"></span>
                            </span>
                            <span className="text-sm font-medium text-user-text">Live on Sepolia Testnet</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-user-text leading-tight animate-in slide-in-from-bottom-5 fade-in duration-700 delay-100">
                            The Future of <br />
                            <span className="text-gradient-user">Decentralized</span> <br />
                            Library
                        </h1>

                        <p className="text-xl text-user-muted max-w-xl mx-auto lg:mx-0 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-200">
                            Experience a transparent, secure, and immutable way to borrow and share knowledge. Powered by Ethereum blockchain technology.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-300">
                            <Button
                                onClick={connectWallet}
                                className="!px-8 !py-4 !text-lg shadow-xl shadow-user-primary/25 hover:shadow-2xl hover:shadow-user-primary/40 hover:-translate-y-1"
                            >
                                <Wallet className="mr-2" />
                                Connect Wallet
                            </Button>
                            <Button
                                variant="secondary"
                                className="!px-8 !py-4 !text-lg hover:-translate-y-1"
                                onClick={() => window.open('https://sepolia.etherscan.io/', '_blank')}
                            >
                                View Contract
                                <ArrowRight className="ml-2" size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative lg:h-[600px] flex items-center justify-center animate-in zoom-in-95 fade-in duration-1000 delay-300">
                        <div className="relative w-full max-w-md aspect-square">
                            {/* Floating Elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-user-primary/20 to-user-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>

                            <div className="relative z-10 animate-float">
                                <div className="glass p-8 rounded-3xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
                                    <img
                                        src={logo}
                                        alt="App Interface"
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                    />

                                    {/* Floating Cards */}
                                    <div className="absolute -left-12 top-1/2 glass p-4 rounded-xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-user-muted">Security</p>
                                                <p className="font-bold text-user-text">100% Secure</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute -right-8 bottom-12 glass p-4 rounded-xl shadow-xl animate-float" style={{ animationDelay: '2s' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-user-muted">Speed</p>
                                                <p className="font-bold text-user-text">Instant</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-24">
                    <Card className="group hover:border-user-primary/50">
                        <div className="w-14 h-14 rounded-2xl bg-user-primary/10 flex items-center justify-center text-user-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-user-text mb-3">Decentralized Library</h3>
                        <p className="text-user-muted">
                            Access a vast collection of books stored on IPFS. No central authority, just pure knowledge sharing.
                        </p>
                    </Card>

                    <Card className="group hover:border-user-secondary/50">
                        <div className="w-14 h-14 rounded-2xl bg-user-secondary/10 flex items-center justify-center text-user-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-user-text mb-3">Smart Borrowing</h3>
                        <p className="text-user-muted">
                            Automated borrowing and returning process handled by smart contracts. Transparent and efficient.
                        </p>
                    </Card>

                    <Card className="group hover:border-user-accent/50">
                        <div className="w-14 h-14 rounded-2xl bg-user-accent/10 flex items-center justify-center text-user-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Shield size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-user-text mb-3">Immutable History</h3>
                        <p className="text-user-muted">
                            Every transaction is recorded on the blockchain. Build your reputation as a trustworthy reader.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;
