import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { IPFS_GATEWAY, CONTRACT_ADDRESS } from '../constants';
import { History as HistoryIcon, BookOpen, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

// Legacy ABI for older contract versions (without deposit/dueDate)
const LEGACY_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "_memberAddress", "type": "address" }],
        "name": "getMemberBorrowHistory",
        "outputs": [{
            "components": [
                { "internalType": "uint256", "name": "borrowId", "type": "uint256" },
                { "internalType": "address", "name": "borrower", "type": "address" },
                { "internalType": "uint256", "name": "bookId", "type": "uint256" },
                { "internalType": "uint256", "name": "borrowTime", "type": "uint256" },
                { "internalType": "uint256", "name": "returnTime", "type": "uint256" },
                { "internalType": "bool", "name": "returned", "type": "bool" }
            ],
            "internalType": "struct Library.BorrowHistory[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "borrowHistory",
        "outputs": [
            { "internalType": "uint256", "name": "borrowId", "type": "uint256" },
            { "internalType": "address", "name": "borrower", "type": "address" },
            { "internalType": "uint256", "name": "bookId", "type": "uint256" },
            { "internalType": "uint256", "name": "borrowTime", "type": "uint256" },
            { "internalType": "uint256", "name": "returnTime", "type": "uint256" },
            { "internalType": "bool", "name": "returned", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const MyHistory = () => {
    const { contract, account, web3 } = useWeb3();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (contract && account) {
            loadHistory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, account]);

    const fetchMetadata = async (cid) => {
        try {
            const res = await fetch(IPFS_GATEWAY + cid);
            return await res.json();
        } catch {
            return { name: 'Unknown Book', author: 'Unknown' };
        }
    };

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Loading history for account:', account);

            let memberHistory = [];

            // 1. Try Standard ABI
            try {
                memberHistory = await contract.methods.getMemberBorrowHistory(account).call();
            } catch (err) {
                console.warn('⚠️ Standard ABI failed, trying Legacy ABI...', err.message);

                // 2. Try Legacy ABI (if web3 is available)
                if (web3) {
                    try {
                        const legacyContract = new web3.eth.Contract(LEGACY_ABI, CONTRACT_ADDRESS);
                        memberHistory = await legacyContract.methods.getMemberBorrowHistory(account).call();
                        console.log('✅ Legacy ABI success');
                    } catch (legacyErr) {
                        console.error('❌ Legacy ABI also failed:', legacyErr.message);

                        // 3. Fallback: Loop through borrowHistory mapping
                        console.log('🔄 Falling back to manual loop...');
                        try {
                            const borrowCount = await contract.methods.borrowCount().call();
                            if (borrowCount > 0) {
                                for (let i = 1; i <= borrowCount; i++) {
                                    try {
                                        // Try standard mapping access
                                        let record = await contract.methods.borrowHistory(i).call();
                                        const borrower = record.borrower || record[1];
                                        if (borrower && borrower.toLowerCase() === account.toLowerCase()) {
                                            memberHistory.push(record);
                                        }
                                    } catch (mapErr) {
                                        // Try legacy mapping access
                                        if (web3) {
                                            const legacyContract = new web3.eth.Contract(LEGACY_ABI, CONTRACT_ADDRESS);
                                            const record = await legacyContract.methods.borrowHistory(i).call();
                                            const borrower = record.borrower || record[1];
                                            if (borrower && borrower.toLowerCase() === account.toLowerCase()) {
                                                memberHistory.push(record);
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (loopErr) {
                            console.error('❌ Manual loop failed:', loopErr);
                        }
                    }
                }
            }

            if (!memberHistory || memberHistory.length === 0) {
                setHistory([]);
                setLoading(false);
                return;
            }

            const historyWithMeta = [];

            // Process each history record
            for (let i = 0; i < memberHistory.length; i++) {
                const record = memberHistory[i];
                try {
                    let bookId;
                    if (typeof record === 'object') {
                        bookId = record.bookId || record[2];
                    }

                    if (!bookId || bookId === '0') continue;

                    const book = await contract.methods.getBook(bookId).call();
                    const meta = await fetchMetadata(book.ipfsHash);

                    historyWithMeta.push({
                        borrowId: record.borrowId || record[0],
                        borrower: account,
                        bookId: bookId,
                        borrowTime: record.borrowTime || record[3],
                        returnTime: record.returnTime || record[4],
                        returned: record.returned || record[5],
                        // Handle missing fields gracefully
                        dueDate: record.dueDate || record[6] || 0,
                        deposit: record.deposit || record[7] || 0,
                        ...meta
                    });
                } catch (err) {
                    console.error(`❌ Error processing record ${i + 1}:`, err);
                }
            }

            // Sort by borrow time (newest first)
            historyWithMeta.sort((a, b) => Number(b.borrowTime) - Number(a.borrowTime));
            setHistory(historyWithMeta);
        } catch (err) {
            console.error('❌ Error loading history:', err);
            setError(err.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-user-primary/10 rounded-full flex items-center justify-center animate-pulse">
                        <HistoryIcon size={32} className="text-user-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-user-text">Loading History...</h3>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle size={32} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-user-text mb-2">Error loading history</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={loadHistory}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-heading font-bold text-user-text mb-2">My History</h1>
                <p className="text-user-muted text-lg">Your journey through our decentralized library</p>
            </div>

            {history.length > 0 ? (
                <div className="relative border-l-2 border-user-border ml-4 md:ml-8 space-y-12 pb-8">
                    {history.map((record, index) => {
                        const borrowDate = new Date(Number(record.borrowTime) * 1000).toLocaleDateString(undefined, {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const returnDate = record.returned
                            ? new Date(Number(record.returnTime) * 1000).toLocaleDateString()
                            : 'Not returned yet';

                        return (
                            <div key={index} className="relative pl-8 md:pl-12 group">
                                {/* Timeline Dot */}
                                <div className={`
                                    absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm transition-colors duration-300
                                    ${record.returned ? 'bg-emerald-500' : 'bg-user-primary'}
                                `}></div>

                                <Card className="group-hover:border-user-primary/30 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Icon/Image Placeholder */}
                                        <div className={`
                                            w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0
                                            ${record.returned ? 'bg-emerald-500/10 text-emerald-600' : 'bg-user-primary/10 text-user-primary'}
                                        `}>
                                            <BookOpen size={32} />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <h3 className="text-xl font-bold text-user-text">{record.name}</h3>
                                                <Badge variant={record.returned ? 'success' : 'info'}>
                                                    {record.returned ? 'Returned' : 'Active Borrow'}
                                                </Badge>
                                            </div>

                                            <p className="text-user-muted font-medium">{record.author || record.description || 'Unknown Author'}</p>

                                            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-user-border/50">
                                                <div className="flex items-center gap-2 text-sm text-user-muted">
                                                    <Calendar size={16} className="text-user-primary" />
                                                    <span>Borrowed: <span className="font-semibold text-user-text">{borrowDate}</span></span>
                                                </div>
                                                {record.returned && (
                                                    <div className="flex items-center gap-2 text-sm text-user-muted">
                                                        <CheckCircle size={16} className="text-emerald-500" />
                                                        <span>Returned: <span className="font-semibold text-user-text">{returnDate}</span></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-user-border border-dashed">
                    <div className="w-20 h-20 bg-user-bg rounded-full flex items-center justify-center mx-auto mb-6 text-user-muted">
                        <HistoryIcon size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-user-text mb-2">No history yet</h3>
                    <p className="text-user-muted">Start borrowing books to see your history timeline</p>
                    <div className="mt-8">
                        <Button onClick={() => window.location.href = '/books'}>Browse Books</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyHistory;
