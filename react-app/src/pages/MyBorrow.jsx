import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { IPFS_GATEWAY, BOOK_PDF_LINKS } from '../constants';
import { Library, BookOpen, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BookReader } from '../components/ui/BookReader';
import { PDFCover } from '../components/ui/PDFCover';

const MyBorrow = () => {
    const { contract, account } = useWeb3();
    const [currentBorrow, setCurrentBorrow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isReaderOpen, setIsReaderOpen] = useState(false);

    useEffect(() => {
        if (contract && account) {
            loadCurrentBorrow();
        }
    }, [contract, account]);

    const fetchMetadata = async (cid) => {
        try {
            const res = await fetch(IPFS_GATEWAY + cid);
            return await res.json();
        } catch {
            return { name: 'Unknown Book', author: 'Unknown' };
        }
    };

    const loadCurrentBorrow = async () => {
        try {
            const id = await contract.methods.getCurrentBorrow(account).call();
            if (id > 0) {
                const book = await contract.methods.getBook(id).call();
                const meta = await fetchMetadata(book.ipfsHash);
                setCurrentBorrow({ ...book, ...meta, id });
            } else {
                setCurrentBorrow(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const returnBook = async () => {
        try {
            setLoading(true);
            await contract.methods.returnBook(currentBorrow.id).send({ from: account });
            alert('Book returned successfully!');
            loadCurrentBorrow();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPdfUrl = () => {
        if (!currentBorrow) return null;
        const index = parseInt(currentBorrow.id) - 1;
        return BOOK_PDF_LINKS[index] || null;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-heading font-bold text-user-text mb-2">My Borrowed Book</h1>
                <p className="text-user-muted text-lg">Manage your currently borrowed book</p>
            </div>

            {currentBorrow ? (
                <div className="relative">
                    {/* Background Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-user-primary to-user-secondary rounded-3xl blur opacity-20"></div>

                    <Card className="relative overflow-hidden border-user-primary/20">
                        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-user-primary/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            {/* Book Cover / Icon */}
                            <div className="w-full md:w-48 aspect-[3/4] rounded-2xl bg-gradient-to-br from-user-bg to-slate-200 flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden">
                                <PDFCover url={getPdfUrl()} className="w-full h-full" />
                            </div>

                            <div className="flex-1 w-full space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="info" className="animate-pulse">Active Borrow</Badge>
                                        <span className="text-sm text-user-muted flex items-center gap-1">
                                            <Clock size={14} />
                                            Due in 7 days
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-heading font-bold text-user-text mb-2">{currentBorrow.name}</h2>
                                    <p className="text-xl text-user-muted font-medium">{currentBorrow.author}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-6 border-y border-user-border/50">
                                    <div className="space-y-1">
                                        <p className="text-xs text-user-muted uppercase tracking-wider font-semibold">Borrow Date</p>
                                        <div className="flex items-center gap-2 text-user-text font-medium">
                                            <Calendar size={18} className="text-user-primary" />
                                            Today
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-user-muted uppercase tracking-wider font-semibold">Status</p>
                                        <div className="flex items-center gap-2 text-user-text font-medium">
                                            <CheckCircle size={18} className="text-emerald-500" />
                                            Good Standing
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        onClick={returnBook}
                                        disabled={loading}
                                        className="flex-1 py-4 text-lg"
                                    >
                                        {loading ? 'Processing Return...' : 'Return Book Now'}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="flex-1 py-4 text-lg"
                                        onClick={() => setIsReaderOpen(true)}
                                    >
                                        Read Book
                                    </Button>
                                </div>

                                <p className="text-xs text-center text-user-muted">
                                    <AlertCircle size={12} className="inline mr-1" />
                                    Please return the book before the due date to avoid penalties.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-user-border border-dashed">
                    <div className="w-24 h-24 bg-user-bg rounded-full flex items-center justify-center mx-auto mb-6 text-user-muted">
                        <Library size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-user-text mb-2">No active borrow</h3>
                    <p className="text-user-muted mb-8 text-lg max-w-md mx-auto">You haven't borrowed any books yet. Explore our catalog to find your next read.</p>
                    <Button onClick={() => window.location.href = '/books'} className="px-8 py-3 text-lg">
                        Browse Library
                    </Button>
                </div>
            )}

            {/* PDF Reader Modal */}
            <BookReader
                isOpen={isReaderOpen}
                onClose={() => setIsReaderOpen(false)}
                pdfUrl={getPdfUrl()}
                title={currentBorrow?.name}
            />
        </div>
    );
};

export default MyBorrow;
