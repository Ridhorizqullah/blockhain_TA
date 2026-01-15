import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { IPFS_GATEWAY, BOOK_PDF_LINKS } from '../constants';
import { Search, BookOpen, ExternalLink, AlertCircle, CheckCircle, Coins } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { BookReader } from '../components/ui/BookReader';
import { PDFCover } from '../components/ui/PDFCover';

const Books = () => {
    const { contract, account, isMember, web3 } = useWeb3();
    const [books, setBooks] = useState([]);
    const [currentBorrow, setCurrentBorrow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [depositAmount, setDepositAmount] = useState('0');
    const [readingBook, setReadingBook] = useState(null);

    useEffect(() => {
        if (contract) {
            loadBooks();
            loadDeposit();
            if (isMember) loadCurrentBorrow();
        }
    }, [contract, isMember]);

    const fetchMetadata = async (cid) => {
        try {
            const res = await fetch(IPFS_GATEWAY + cid);
            return await res.json();
        } catch {
            return { name: 'Unknown Book', author: 'Unknown' };
        }
    };

    const loadDeposit = async () => {
        try {
            const deposit = await contract.methods.DEPOSIT_PER_MINUTE().call();
            setDepositAmount(deposit);
        } catch (err) {
            console.warn('Could not load deposit amount:', err);
            setDepositAmount('0');
        }
    };

    const loadBooks = async () => {
        try {
            const ids = await contract.methods.getAllBookIds().call();
            const bookList = [];
            for (const id of ids) {
                const book = await contract.methods.getBook(id).call();
                const meta = await fetchMetadata(book.ipfsHash);
                bookList.push({ ...book, ...meta, id });
            }
            setBooks(bookList);
        } catch (err) {
            console.error(err);
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

    const borrowBook = async (id) => {
        try {
            setLoading(true);
            console.log(`Attempting to borrow book ${id}...`);

            // 1. Try with deposit (Standard Contract)
            try {
                const deposit = await contract.methods.DEPOSIT_PER_MINUTE().call();
                console.log(`Sending with deposit: ${deposit}`);
                await contract.methods.borrowBook(id).send({ from: account, value: deposit });
                alert('Book borrowed successfully!');
                loadBooks();
                loadCurrentBorrow();
            } catch (err) {
                console.warn('Standard borrow failed, trying legacy (no deposit)...', err.message);

                // 2. Try without deposit (Legacy Contract)
                try {
                    await contract.methods.borrowBook(id).send({ from: account });
                    alert('Book borrowed successfully (Legacy Mode)!');
                    loadBooks();
                    loadCurrentBorrow();
                } catch (legacyErr) {
                    console.error('Legacy borrow also failed:', legacyErr);
                    throw legacyErr;
                }
            }
        } catch (err) {
            console.error('Borrow error:', err);
            if (err.message.includes('active borrow')) {
                alert('Error: You already have an active borrow. Please return your current book first.');
            } else {
                alert('Error borrowing book: ' + (err.message || 'Transaction reverted'));
            }
        } finally {
            setLoading(false);
        }
    };

    const returnBook = async (id) => {
        try {
            setLoading(true);
            await contract.methods.returnBook(id).send({ from: account });
            alert('Book returned successfully!');
            loadBooks();
            loadCurrentBorrow();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(
        (book) =>
            book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatEth = (wei) => {
        if (!web3) return '0';
        return web3.utils.fromWei(wei, 'ether');
    };

    const handleReadBook = (bookId, bookName) => {
        const index = parseInt(bookId) - 1;
        const pdfLink = BOOK_PDF_LINKS[index] || null;
        setReadingBook({ url: pdfLink, title: bookName });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {currentBorrow && (
                <div className="bg-gradient-to-r from-user-secondary/20 to-user-primary/20 border border-user-primary/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-user-primary/20 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center text-user-primary shadow-sm">
                                <BookOpen size={32} />
                            </div>
                            <div>
                                <Badge variant="info" className="mb-2">Currently Borrowed</Badge>
                                <h3 className="font-heading font-bold text-2xl text-user-text">{currentBorrow.name}</h3>
                                <p className="text-user-muted">{currentBorrow.author}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => returnBook(currentBorrow.id)}
                            disabled={loading}
                            variant="primary"
                            className="w-full md:w-auto"
                        >
                            Return Book
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-heading font-bold text-user-text mb-2">Library Catalog</h1>
                    <p className="text-user-muted text-lg">Explore our decentralized collection of knowledge</p>
                </div>

                <div className="w-full md:w-96">
                    <Input
                        icon={Search}
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => {
                        const index = parseInt(book.id) - 1;
                        const pdfLink = BOOK_PDF_LINKS[index] || null;
                        const isAvailable = book.stock > 0;
                        const isBorrowedByMe = currentBorrow && currentBorrow.id === book.id;

                        return (
                            <Card key={book.id} className="flex flex-col h-full group">
                                <div className="mb-6 relative">
                                    <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-user-bg to-slate-200 flex items-center justify-center mb-4 group-hover:scale-[1.02] transition-transform duration-300 shadow-inner overflow-hidden">
                                        <PDFCover url={pdfLink} className="w-full h-full" />
                                    </div>
                                    <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                                        <Badge variant={isAvailable ? 'success' : 'error'}>
                                            {isAvailable ? `${book.stock} Available` : 'Out of Stock'}
                                        </Badge>
                                        {depositAmount !== '0' && (
                                            <Badge variant="warning" className="bg-amber-100 text-amber-700 border-amber-200">
                                                <Coins size={12} className="mr-1" />
                                                {formatEth(depositAmount)} ETH
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-auto">
                                    <h3 className="font-heading font-bold text-lg text-user-text mb-1 line-clamp-2 group-hover:text-user-primary transition-colors">
                                        {book.name}
                                    </h3>
                                    <p className="text-sm text-user-muted mb-4">{book.author}</p>
                                </div>

                                <div className="space-y-3 mt-4">
                                    {isMember ? (
                                        <Button
                                            onClick={() => borrowBook(book.id)}
                                            disabled={loading || !isAvailable || currentBorrow}
                                            variant={!isAvailable || currentBorrow ? 'secondary' : 'primary'}
                                            className="w-full"
                                        >
                                            {isBorrowedByMe ? 'Borrowed' : currentBorrow ? 'Limit Reached' : !isAvailable ? 'Out of Stock' : 'Borrow Now'}
                                        </Button>
                                    ) : (
                                        <Button disabled variant="secondary" className="w-full">
                                            Register to Borrow
                                        </Button>
                                    )}

                                    {isBorrowedByMe && (
                                        <Button
                                            onClick={() => handleReadBook(book.id, book.name)}
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            <ExternalLink size={16} className="mr-2" />
                                            Read PDF
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-user-bg rounded-full flex items-center justify-center mx-auto mb-6 text-user-muted">
                        <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-user-text mb-2">No books found</h3>
                    <p className="text-user-muted">Try adjusting your search terms or browse our collection</p>
                </div>
            )}

            {/* PDF Reader Modal */}
            <BookReader
                isOpen={!!readingBook}
                onClose={() => setReadingBook(null)}
                pdfUrl={readingBook?.url}
                title={readingBook?.title}
            />
        </div>
    );
};

export default Books;
