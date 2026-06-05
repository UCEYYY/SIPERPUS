// frontend/src/schemas/bukuSchema.js
// Skema validasi Yup untuk form Buku
// Aturan HARUS sinkron dengan express-validator di backend
import * as Yup from 'yup'

const tahunSekarang = new Date().getFullYear()

export const bukuSchema = Yup.object({
  judul: Yup.string()
    .required('Judul buku wajib diisi')
    .min(3, 'Judul minimal 3 karakter')
    .max(255, 'Judul maksimal 255 karakter'),

  penulis: Yup.string()
    .required('Nama penulis wajib diisi')
    .min(3, 'Nama penulis minimal 3 karakter')
    .max(255, 'Nama penulis maksimal 255 karakter'),

  penerbit: Yup.string()
    .optional()
    .max(255, 'Nama penerbit maksimal 255 karakter'),

  tahun: Yup.number()
    .optional()
    .typeError('Tahun harus berupa angka')
    .integer('Tahun harus bilangan bulat')
    .min(1800, 'Tahun terbit tidak valid (minimal 1800)')
    .max(tahunSekarang, `Tahun tidak boleh lebih dari ${tahunSekarang}`),

  isbn: Yup.string()
    .optional()
    .matches(
      /^97[89]\d{10}$/,
      'Format ISBN tidak valid (contoh: 9780132350884 — 13 digit, awali 978/979)',
    ),

  kategori: Yup.string().required('Kategori wajib dipilih'),

  stok: Yup.number()
    .required('Jumlah stok wajib diisi')
    .typeError('Stok harus berupa angka')
    .integer('Stok harus bilangan bulat')
    .min(0, 'Stok tidak boleh negatif')
    .max(9999, 'Stok maksimal 9999'),

  sinopsis: Yup.string().optional().max(2000, 'Sinopsis maksimal 2000 karakter'),
})
