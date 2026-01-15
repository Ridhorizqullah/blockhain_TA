import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { IPFS_GATEWAY, BOOK_METADATA_CIDS, BOOK_PDF_LINKS } from '../constants';
import { Plus, BookOpen, ExternalLink, Search, FileText, Layers, Hash } from 'lucide-react';
import { AdminCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PDFCover } from '../components/ui/PDFCover';

const AdminBooks = () => {
    const { contract, account } = useWeb3();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        ipfs: '',
        stock: ''
    });

    useEffect(() => {
        if (contract) {
            loadBooks();
        }
    }, [contract]);

    const fetchMetadata = async (cid) => {
        try {
            const res = await fetch(IPFS_GATEWAY + cid);
            return await res.json();
        } catch {
            return { name: 'Unknown Book', author: 'Unknown' };
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.ipfs || !formData.stock) {
            alert('Please fill IPFS CID and stock');
            return;
        }

        try {
            setLoading(true);
            await contract.methods.addBook(formData.ipfs, formData.stock).send({ from: account });
            alert('Book added successfully!');
            setFormData({ title: '', author: '', ipfs: '', stock: '' });
            loadBooks();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book =>
        book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-heading font-bold text-admin-text mb-2">Manage Books</h1>
                <p className="text-admin-muted">Add new books and manage existing inventory</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Add Book Form */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminCard>
                        <h2 className="text-xl font-bold text-admin-text mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-admin-primary" />
                            Add New Book
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-admin-muted uppercase tracking-wider">Book Details (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Book Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl text-admin-text focus:outline-none focus:border-admin-primary transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Author Name"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl text-admin-text focus:outline-none focus:border-admin-primary transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-admin-muted uppercase tracking-wider">Blockchain Data</label>
                                <input
                                    type="text"
                                    placeholder="IPFS CID (Metadata)"
                                    value={formData.ipfs}
                                    onChange={(e) => setFormData({ ...formData, ipfs: e.target.value })}
                                    className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl text-admin-text focus:outline-none focus:border-admin-primary transition-all font-mono text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Initial Stock"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-4 py-3 bg-admin-bg border border-admin-border rounded-xl text-admin-text focus:outline-none focus:border-admin-primary transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-2"
                            >
                                {loading ? 'Adding Book...' : 'Add Book to Library'}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-admin-border">
                            <p className="text-xs font-semibold text-admin-muted uppercase tracking-wider mb-3">Quick Fill (Test Data)</p>
                            <div className="flex flex-wrap gap-2">
                                {BOOK_METADATA_CIDS.map((cid, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setFormData({ ...formData, ipfs: cid })}
                                        className="px-2 py-1 text-[10px] bg-admin-bg border border-admin-border rounded hover:border-admin-primary text-admin-muted hover:text-admin-primary transition-all font-mono"
                                        title={cid}
                                    >
                                        Book {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard>
                        <h2 className="text-xl font-bold text-admin-text mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-admin-primary" />
                            PDF Resources
                        </h2>
                        <div className="space-y-2">
                            {BOOK_PDF_LINKS.map((link, index) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-admin-bg border border-admin-border rounded-lg text-admin-text hover:border-admin-primary/50 hover:bg-admin-surface transition-all group"
                                >
                                    <span className="text-sm font-medium">Book {index + 1} PDF</span>
                                    <ExternalLink size={14} className="text-admin-muted group-hover:text-admin-primary" />
                                </a>
                            ))}
                        </div>
                    </AdminCard>
                </div>

                {/* Book Catalog */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4 bg-admin-surface p-4 rounded-xl border border-admin-border">
                        <Search size={20} className="text-admin-muted" />
                        <input
                            type="text"
                            placeholder="Search books by title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-admin-text w-full placeholder:text-admin-muted"
                        />
                    </div>

                    <div className="grid gap-4">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <AdminCard key={book.id} className="group hover:border-admin-primary/30 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-20 bg-admin-bg rounded-lg flex items-center justify-center flex-shrink-0 border border-admin-border overflow-hidden">
                                            <PDFCover url={BOOK_PDF_LINKS[parseInt(book.id) - 1]} className="w-full h-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-admin-text truncate">{book.name}</h3>
                                                    <p className="text-admin-muted">{book.author}</p>
                                                </div>
                                                <Badge variant={book.stock > 0 ? 'success' : 'danger'}>
                                                    {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-6 mt-4">
                                                <div className="flex items-center gap-2 text-sm text-admin-muted">
                                                    <Layers size={14} className="text-admin-primary" />
                                                    <span>Stock: <span className="text-admin-text font-bold">{book.stock}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-admin-muted">
                                                    <Hash size={14} className="text-admin-primary" />
                                                    <span className="font-mono text-xs truncate max-w-[150px]" title={book.ipfsHash}>
                                                        {book.ipfsHash?.substring(0, 10)}...
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </AdminCard>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-admin-surface rounded-xl border border-admin-border border-dashed">
                                <p className="text-admin-muted">No books found matching your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBooks;
