# 📚 Smart Library - Blockchain System

Sistem perpustakaan terdesentralisasi berbasis blockchain Ethereum (Sepolia Testnet) dengan smart contract untuk manajemen buku, anggota, dan peminjaman.

## 🎨 Dual Interface

### 👤 User Interface (Dark Theme)
- **File**: `src/index.html`
- **Theme**: Dark mode dengan warna hijau (#00DC82)
- **Akses**: `http://localhost:8080` atau `npm run dev`
- **Fitur**:
  - Dashboard dengan statistik
  - Katalog buku
  - Peminjaman buku dengan deposit
  - Riwayat peminjaman
  - PDF viewer untuk membaca buku

### 👨‍💼 Admin Interface (Light Theme)
- **File**: `src/admin.html`
- **Theme**: Light mode dengan warna ungu (#8B5CF6)
- **Akses**: `http://localhost:8080/admin.html`
- **Fitur**:
  - Dashboard admin
  - Tambah buku baru
  - Manajemen member
  - Monitoring peminjaman
  - System status

## 🔧 Teknologi

- **Blockchain**: Ethereum Sepolia Testnet
- **Smart Contract**: Solidity ^0.8.20
- **Frontend**: HTML, CSS, JavaScript
- **Web3**: Web3.js v1.10.0
- **Storage**: IPFS (Pinata) untuk metadata buku
- **Development**: Truffle, Ganache

## 📋 Fitur Utama

### ⏱️ Testing Mode (1 Menit = 0.001 ETH)
- **Durasi Peminjaman**: 60 detik (1 menit)
- **Deposit**: 0.001 ETH per menit
- **Refund**:
  - ✅ Tepat waktu: 100% refund
  - ⚠️ Terlambat: 50% refund

### 📖 Manajemen Buku
- Upload buku dengan IPFS hash
- Set stok buku
- Track ketersediaan real-time

### 👥 Manajemen Member
- Registrasi member on-chain
- Track riwayat peminjaman
- Validasi status member

### 🔄 Peminjaman
- Deposit otomatis saat pinjam
- Due date tracking
- Overdue detection
- Auto-refund saat return

## 🚀 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan Alchemy API key dan mnemonic Anda

# Compile smart contract
truffle compile

# Deploy ke Sepolia
truffle migrate --network sepolia

# Run development server
npm run dev
```

## 🔑 Environment Variables

```env
# Alchemy API Key (dari https://www.alchemy.com/)
ALCHEMY_API_KEY=your_alchemy_api_key_here

# Mnemonic phrase dari MetaMask (12 kata)
MNEMONIC=your twelve word mnemonic phrase goes here
```

## 📝 Smart Contract Functions

### Public Functions
- `registerMember(string _name)` - Registrasi member
- `borrowBook(uint _bookId)` - Pinjam buku (payable)
- `returnBook(uint _bookId)` - Kembalikan buku
- `getBook(uint _bookId)` - Info buku
- `getCurrentBorrow(address)` - Buku yang sedang dipinjam
- `isOverdue(address)` - Cek keterlambatan
- `getDueDate(address)` - Tanggal jatuh tempo

### Admin Functions
- `addBook(string _ipfsHash, uint _stock)` - Tambah buku
- `updateBookStock(uint _bookId, uint _newStock)` - Update stok

### View Functions
- `getLibraryStats()` - Statistik perpustakaan
- `getAllBorrowHistory()` - Semua riwayat
- `getMemberBorrowHistory(address)` - Riwayat member
- `calculateRequiredDeposit()` - Hitung deposit

## ⚠️ Important Notes

### Auto-Return
**Smart contract TIDAK bisa auto-return secara otomatis!**
- Blockchain tidak bisa menjalankan kode secara otomatis
- User harus **manual return** melalui UI
- Contract hanya **mendeteksi overdue** dan **mengurangi refund**
- Testing script mensimulasikan auto-return dengan wait timer

### Testing Mode
- Durasi 1 menit untuk testing cepat
- Production: ubah `BORROW_DURATION` ke 7 days (604800 detik)
- Deposit disesuaikan dengan durasi

## 🎯 Usage Flow

### User Flow
1. Connect wallet (MetaMask)
2. Register sebagai member
3. Browse katalog buku
4. Pinjam buku (bayar deposit 0.001 ETH)
5. Baca buku via PDF viewer
6. Return buku sebelum due date
7. Terima refund (100% atau 50%)

### Admin Flow
1. Connect wallet admin
2. Akses admin panel
3. Tambah buku baru dengan IPFS hash
4. Monitor member & peminjaman
5. Lihat statistik sistem

## 🐛 Troubleshooting

### "Insufficient balance"
- Pastikan wallet punya Sepolia ETH
- Faucet: https://sepoliafaucet.com/

### "User denied transaction"
- Approve transaksi di MetaMask
- Cek gas fee cukup

### "Book not found"
- Pastikan book ID valid
- Cek dengan `getBook(bookId)`

### Testing gagal
- Cek .env sudah benar
- Pastikan contract sudah deploy
- Cek balance wallet cukup

## 📄 License

MIT License

## 👥 Team

Blockchain Library System - Tugas Akhir

---

**Happy Coding! 🚀**
