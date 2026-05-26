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

siperpus/
siperpus-frontend/
├── src/
│   ├── assets/
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components/
│   │   ├── buku/
│   │   │   └── KartuBuku.vue
│   │   ├── layout/
│   │   │   ├── AppHeader.vue
│   │   │   └── DashboardLayout.vue
│   │   └── ui/
│   │       ├── alert/
│   │       │   ├── Alert.vue
│   │       │   ├── AlertDescription.vue
│   │       │   ├── AlertTitle.vue
│   │       │   └── index.js
│   │       ├── avatar/
│   │       │   ├── Avatar.vue
│   │       │   ├── AvatarFallback.vue
│   │       │   ├── AvatarImage.vue
│   │       │   └── index.js
│   │       ├── badge/
│   │       │   ├── Badge.vue
│   │       │   └── index.js
│   │       ├── button/
│   │       │   ├── Button.vue
│   │       │   └── index.js
│   │       ├── card/
│   │       │   ├── Card.vue
│   │       │   ├── CardAction.vue
│   │       │   ├── CardContent.vue
│   │       │   ├── CardDescription.vue
│   │       │   ├── CardFooter.vue
│   │       │   ├── CardHeader.vue
│   │       │   ├── CardTitle.vue
│   │       │   └── index.js
│   │       ├── dropdown-menu/
│   │       │   ├── DropdownMenu.vue
│   │       │   ├── DropdownMenuCheckboxItem.vue
│   │       │   ├── DropdownMenuContent.vue
│   │       │   ├── DropdownMenuGroup.vue
│   │       │   ├── DropdownMenuItem.vue
│   │       │   ├── DropdownMenuLabel.vue
│   │       │   ├── DropdownMenuRadioGroup.vue
│   │       │   ├── DropdownMenuRadioItem.vue
│   │       │   ├── DropdownMenuSeparator.vue
│   │       │   ├── DropdownMenuShortcut.vue
│   │       │   ├── DropdownMenuSub.vue
│   │       │   ├── DropdownMenuSubContent.vue
│   │       │   ├── DropdownMenuSubTrigger.vue
│   │       │   ├── DropdownMenuTrigger.vue
│   │       │   └── index.js
│   │       ├── input/
│   │       │   ├── Input.vue
│   │       │   └── index.js
│   │       ├── select/
│   │       │   ├── Select.vue
│   │       │   ├── SelectContent.vue
│   │       │   ├── SelectGroup.vue
│   │       │   ├── SelectItem.vue
│   │       │   ├── SelectItemText.vue
│   │       │   ├── SelectLabel.vue
│   │       │   ├── SelectScrollDownButton.vue
│   │       │   ├── SelectScrollUpButton.vue
│   │       │   ├── SelectSeparator.vue
│   │       │   ├── SelectTrigger.vue
│   │       │   ├── SelectValue.vue
│   │       │   └── index.js
│   │       ├── separator/
│   │       │   ├── Separator.vue
│   │       │   └── index.js
│   │       ├── skeleton/
│   │       │   ├── Skeleton.vue
│   │       │   └── index.js
│   │       ├── DataList.vue
│   │       └── ThemeSwitcher.vue
│   ├── composables/
│   │   └── useApi.js
│   ├── directives/
│   │   ├── vFocus.js
│   │   └── vHighlight.js
│   ├── lib/
│   │   └── utils.js
│   ├── router/
│   │   ├── guards.js
│   │   └── index.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── bukuService.js
│   ├── stores/
│   │   ├── auth.js
│   │   ├── buku.js
│   │   └── counter.js
│   ├── views/
│   │   ├── dashboard/
│   │   │   └── DashboardHomeView.vue
│   │   ├── AboutView.vue
│   │   ├── DetailBukuView.vue
│   │   ├── HomeView.vue
│   │   ├── KatalogView.vue
│   │   ├── LoginView.vue
│   │   └── NotFoundView.vue
│   ├── App.vue
│   └── main.js
├── public/
│   └── favicon.ico
├── e2e/
│   └── vue.spec.js
├── .env
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── playwright.config.js
├── vite.config.js
└── README.md

backend/
├── src/
│   ├── config/database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── buku.routes.js
│   │   ├── anggota.routes.js
│   │   └── peminjaman.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── buku.controller.js
│   │   ├── anggota.controller.js
│   │   └── peminjaman.controller.js
│   └── app.js
├── .env
├── server.js
└── package.json
```