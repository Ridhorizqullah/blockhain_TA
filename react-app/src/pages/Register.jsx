import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { UserPlus, CheckCircle, Library } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Register = () => {
    const { contract, account, setIsMember } = useWeb3();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        try {
            setLoading(true);
            await contract.methods.registerMember(name).send({ from: account });
            setIsMember(true);
            alert('Registration successful!');
            navigate('/books');
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-user-primary to-user-secondary text-white shadow-lg shadow-user-primary/30 mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
                    <Library size={40} />
                </div>
                <h1 className="text-4xl font-heading font-bold text-user-text mb-2">
                    Join the <span className="text-gradient-user">Library</span>
                </h1>
                <p className="text-user-muted text-lg">Start your decentralized reading journey today</p>
            </div>

            <Card className="p-8 border-user-primary/10 shadow-xl shadow-user-primary/5">
                <form onSubmit={handleRegister} className="space-y-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-user-text uppercase tracking-wider">
                            Personal Information
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-user-muted">
                                <UserPlus size={20} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full pl-12 pr-4 py-4 bg-user-bg border border-user-border rounded-xl text-user-text focus:outline-none focus:border-user-primary focus:ring-2 focus:ring-user-primary/20 transition-all text-lg"
                            />
                        </div>
                    </div>

                    <div className="bg-user-bg/50 border border-user-border rounded-xl p-6">
                        <h3 className="font-bold text-user-text mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-user-primary" />
                            Member Benefits
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-user-muted">
                                <div className="w-1.5 h-1.5 rounded-full bg-user-primary mt-2"></div>
                                <span>Borrow books from our decentralized collection instantly</span>
                            </li>
                            <li className="flex items-start gap-3 text-user-muted">
                                <div className="w-1.5 h-1.5 rounded-full bg-user-primary mt-2"></div>
                                <span>Access exclusive PDF resources and reading materials</span>
                            </li>
                            <li className="flex items-start gap-3 text-user-muted">
                                <div className="w-1.5 h-1.5 rounded-full bg-user-primary mt-2"></div>
                                <span>Build your on-chain reading history and reputation</span>
                            </li>
                        </ul>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg shadow-lg shadow-user-primary/20 hover:shadow-xl hover:shadow-user-primary/30"
                    >
                        {loading ? 'Creating Profile...' : 'Create Member Profile'}
                    </Button>
                </form>
            </Card>

            <p className="text-center text-sm text-user-muted mt-6">
                By registering, you agree to our decentralized terms of service.
            </p>
        </div>
    );
};

export default Register;
