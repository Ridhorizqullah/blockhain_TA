import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { IPFS_GATEWAY, CONTRACT_ADDRESS } from '../constants';
import { History as HistoryIcon, BookOpen, Calendar, User, Search, Filter, CheckCircle, Clock } from 'lucide-react';
import { AdminCard } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// Legacy ABI for older contract versions (without deposit/dueDate)
const LEGACY_ABI = [
    {
        "inputs": [],
        "name": "getAllBorrowHistory",
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

const AdminHistory = () => {
    const { contract, web3 } = useWeb3();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (contract) {
            loadHistory();
        }
    }, [contract]);

    const fetchMetadata = async (cid) => {
        try {
            const res = await fetch(IPFS_GATEWAY + cid);
            return await res.json();
        } catch (err) {
            return { name: 'Unknown Book', author: 'Unknown' };
        }
    };

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            // Try to get all borrow history from contract function
            let allHistory = [];

            // 1. Try Standard ABI
            try {
                allHistory = await contract.methods.getAllBorrowHistory().call();
            } catch (err) {
                console.warn('⚠️ Standard ABI failed, trying Legacy ABI...', err.message);

                // 2. Try Legacy ABI (if web3 is available)
                if (web3) {
                    try {
                        const legacyContract = new web3.eth.Contract(LEGACY_ABI, CONTRACT_ADDRESS);
                        allHistory = await legacyContract.methods.getAllBorrowHistory().call();
                        console.log('✅ Legacy ABI success');
                    } catch (legacyErr) {
                        console.error('❌ Legacy ABI also failed:', legacyErr.message);

                        // 3. Fallback: try to get borrowCount and loop
                        console.log('🔄 Falling back to manual loop...');
                        try {
                            const borrowCount = await contract.methods.borrowCount().call();
                            if (borrowCount > 0) {
                                for (let i = 1; i <= borrowCount; i++) {
                                    try {
                                        // Try standard mapping access
                                        const record = await contract.methods.borrowHistory(i).call();
                                        allHistory.push(record);
                                    } catch (mapErr) {
                                        // Try legacy mapping access
                                        if (web3) {
                                            const legacyContract = new web3.eth.Contract(LEGACY_ABI, CONTRACT_ADDRESS);
                                            const record = await legacyContract.methods.borrowHistory(i).call();
                                            allHistory.push(record);
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

            if (!allHistory || allHistory.length === 0) {
                setHistory([]);
                setLoading(false);
                return;
            }

            const historyWithMeta = [];

            // Process each history record
            for (let i = 0; i < allHistory.length; i++) {
                const record = allHistory[i];
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
                        borrower: record.borrower || record[1],
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
                    console.error(`Error processing record ${i + 1}:`, err);
                }
            }

            // Sort by borrow time (newest first)
            historyWithMeta.sort((a, b) => Number(b.borrowTime) - Number(a.borrowTime));
            setHistory(historyWithMeta);
        } catch (err) {
            console.error('Error loading history:', err);
            setError(err.message || 'Failed to load history from blockchain');
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(record =>
        record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.borrower?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-8 w-48 bg-admin-surface rounded-lg mb-2"></div>
                    <div className="h-4 w-64 bg-admin-surface rounded-lg"></div>
                </div>
                <div className="bg-admin-surface border border-admin-border rounded-xl p-12 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-admin-primary/20 rounded-full mb-4"></div>
                    <div className="h-6 w-32 bg-admin-bg rounded-lg mb-2"></div>
                    <div className="h-4 w-48 bg-admin-bg rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-admin-text mb-2">History Logs</h1>
                    <p className="text-admin-muted">All borrowing transactions on the blockchain</p>
                </div>
                <div className="bg-admin-surface border border-red-500/20 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HistoryIcon size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-admin-text mb-1">Error loading history</h3>
                    <p className="text-red-400 mb-6">{error}</p>
                    <button
                        onClick={loadHistory}
                        className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-admin-text mb-2">History Logs</h1>
                    <p className="text-admin-muted">All borrowing transactions on the blockchain</p>
                </div>

                <div className="flex items-center gap-4 bg-admin-surface p-2 rounded-xl border border-admin-border w-full md:w-auto">
                    <Search size={20} className="text-admin-muted ml-2" />
                    <input
                        type="text"
                        placeholder="Search by book or wallet..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-admin-text w-full md:w-64 placeholder:text-admin-muted"
                    />
                </div>
            </div>

            <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden shadow-xl">
                {filteredHistory.length > 0 ? (
                    <div className="divide-y divide-admin-border">
                        {filteredHistory.map((record, index) => {
                            const borrowDate = new Date(Number(record.borrowTime) * 1000).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            });
                            const returnDate = record.returned
                                ? new Date(Number(record.returnTime) * 1000).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })
                                : null;

                            return (
                                <div
                                    key={index}
                                    className="p-6 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`
                                                w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border
                                                ${record.returned
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}
                                            `}>
                                                {record.returned ? <CheckCircle size={24} /> : <Clock size={24} />}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-lg text-admin-text group-hover:text-admin-primary transition-colors">{record.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-admin-muted mt-1">
                                                    <User size={14} />
                                                    <span className="font-mono text-xs bg-admin-bg px-2 py-0.5 rounded border border-admin-border">
                                                        {record.borrower}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-2">
                                            <Badge variant={record.returned ? 'success' : 'warning'}>
                                                {record.returned ? 'Returned' : 'Active Loan'}
                                            </Badge>

                                            <div className="text-xs text-admin-muted text-right space-y-1">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <span>Borrowed:</span>
                                                    <span className="text-admin-text font-medium">{borrowDate}</span>
                                                </div>
                                                {record.returned && (
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <span>Returned:</span>
                                                        <span className="text-admin-text font-medium">{returnDate}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-admin-bg rounded-full flex items-center justify-center mx-auto mb-6 text-admin-muted border border-admin-border border-dashed">
                            <HistoryIcon size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-admin-text mb-2">No history found</h3>
                        <p className="text-admin-muted">
                            {searchTerm ? 'Try adjusting your search terms' : 'Borrowing history will appear here'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHistory;
