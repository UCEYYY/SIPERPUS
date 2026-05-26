# SiPerpus Backend API

Backend REST API untuk Sistem Informasi Perpustakaan (SiPerpus) menggunakan Express.js + MariaDB.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Server berjalan di: `http://localhost:3000`

## Konfigurasi .env

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=siperpus
JWT_SECRET=siperpus_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

---

## Dokumentasi API

### Base URL
```
http://localhost:3000/api
```

### Format Response
```json
{ "success": true, "message": "pesan", "data": { ... } }
```

---

## Auth Endpoints

### POST /api/auth/login
- **Auth required:** Tidak
- **Body:** `{ "email": "admin@siperpus.id", "password": "admin123" }`
- **Response 200:** `{ "success": true, "data": { "token": "eyJ...", "user": { ... } } }`
- **Response 401:** Email atau password salah

### POST /api/auth/register
- **Auth required:** Tidak
- **Body:** `{ "nama": "Budi", "email": "budi@gmail.com", "password": "budi123", "nim": "2021002", "programStudi": "Teknik Informatika" }`
- **Response 201:** Registrasi berhasil

### GET /api/auth/me
- **Auth required:** Ya (Bearer Token)
- **Response 200:** `{ "success": true, "data": { "id": 1, "nama": "...", "role": "..." } }`

---

## Buku Endpoints

### GET /api/buku
- **Auth required:** Tidak
- **Query params:** `search`, `kategori`, `status` (tersedia/dipinjam), `page`, `limit`
- **Response 200:** `{ "success": true, "data": { "items": [...], "pagination": { ... } } }`

### GET /api/buku/:id
- **Auth required:** Tidak
- **Response 200:** `{ "success": true, "data": { ... } }`
- **Response 404:** Buku tidak ditemukan

### POST /api/buku
- **Auth required:** Ya — role: pustakawan
- **Body:**
```json
{
  "judul": "The Pragmatic Programmer",
  "penulis": "David Thomas",
  "penerbit": "Addison-Wesley",
  "tahun": 1999,
  "isbn": "9780201616224",
  "kategori": "Teknologi",
  "sinopsis": "Panduan praktis pemrograman profesional",
  "stok": 2
}
```
- **Response 201:** Buku berhasil ditambahkan
- **Response 401/403:** Tidak terautentikasi / bukan pustakawan
- **Response 422:** Data tidak valid

### PUT /api/buku/:id
- **Auth required:** Ya — role: pustakawan
- **Body:** sama dengan POST /api/buku
- **Response 200:** Buku berhasil diperbarui

### DELETE /api/buku/:id
- **Auth required:** Ya — role: pustakawan
- **Response 200:** Buku berhasil dihapus

### GET /api/buku/statistik
- **Auth required:** Tidak
- **Response 200:** `{ "data": { "totalBuku": 6, "bukuTersedia": 14, "peminjamanAktif": 1 } }`

---

## Anggota Endpoints

### GET /api/anggota
- **Auth required:** Ya — role: pustakawan

### GET /api/anggota/:id
- **Auth required:** Ya — role: pustakawan

### GET /api/anggota/:id/riwayat
- **Auth required:** Ya — role: pustakawan

---

## Peminjaman Endpoints

### POST /api/peminjaman
- **Auth required:** Ya — role: anggota
- **Body:** `{ "buku_id": 1 }`
- **Response 201:** Buku berhasil dipinjam (batas kembali 14 hari)

### PATCH /api/peminjaman/:id/kembalikan
- **Auth required:** Ya — role: pustakawan
- **Response 200:** `{ "data": { "terlambatHari": 0, "denda": 0 } }`

---

## Akun Default

| Role | Email | Password |
|------|-------|----------|
| Pustakawan | admin@siperpus.id | admin123 |
| Anggota | siti@gmail.com | siti123 |

---

## Struktur Folder

```
backend/
├── src/
│   ├── config/database.js
│   ├── middleware/auth.js, errorHandler.js, validate.js
│   ├── routes/auth, buku, anggota, peminjaman
│   ├── controllers/auth, buku, anggota, peminjaman
│   └── app.js
├── .env
├── server.js
└── package.json
```
