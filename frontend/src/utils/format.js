// frontend/src/utils/format.js
// Fungsi-fungsi helper untuk formatting data

/**
 * Format angka menjadi format mata uang Rupiah
 * @param {number} angka
 * @returns {string}
 */
export function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
}

/**
 * Format tanggal ke format Indonesia (misal: 5 Juni 2026)
 * @param {string|Date} tanggal
 * @returns {string}
 */
export function formatTanggal(tanggal) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(tanggal))
}

/**
 * Hitung jumlah hari keterlambatan pengembalian buku
 * @param {string|Date} tanggalKembali - batas waktu pengembalian
 * @returns {number} jumlah hari terlambat (0 jika belum terlambat)
 */
export function hitungHariTerlambat(tanggalKembali) {
  const batas = new Date(tanggalKembali)
  const hari = Math.ceil((new Date() - batas) / (1000 * 60 * 60 * 24))
  return Math.max(0, hari)
}

/**
 * Potong teks jika melebihi panjang tertentu
 * @param {string} teks
 * @param {number} panjang
 * @returns {string}
 */
export function potongTeks(teks, panjang = 100) {
  if (!teks) return ''
  if (teks.length <= panjang) return teks
  return teks.slice(0, panjang) + '...'
}
