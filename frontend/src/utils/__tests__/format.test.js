// frontend/src/utils/__tests__/format.test.js
// Test fungsi-fungsi helper/utility
import { describe, it, expect } from 'vitest'
import { formatRupiah, formatTanggal, hitungHariTerlambat, potongTeks } from '../format'

describe('formatRupiah()', () => {
  it('memformat angka 0 dengan benar', () => {
    expect(formatRupiah(0)).toMatch(/Rp/)
  })

  it('memformat angka besar dengan pemisah ribuan', () => {
    const hasil = formatRupiah(50000)
    expect(hasil).toContain('50')
    expect(hasil).toContain('000')
  })

  it('mengandung simbol mata uang IDR', () => {
    const hasil = formatRupiah(10000)
    expect(hasil).toMatch(/Rp|IDR/)
  })

  it('memformat angka negatif', () => {
    const hasil = formatRupiah(-5000)
    expect(hasil).toBeTruthy()
  })
})

describe('formatTanggal()', () => {
  it('mengembalikan string yang tidak kosong', () => {
    const hasil = formatTanggal('2026-01-15')
    expect(hasil).toBeTruthy()
    expect(typeof hasil).toBe('string')
  })

  it('mengandung tahun yang benar', () => {
    const hasil = formatTanggal('2026-06-05')
    expect(hasil).toContain('2026')
  })

  it('menerima objek Date', () => {
    const tanggal = new Date('2025-12-25')
    const hasil = formatTanggal(tanggal)
    expect(hasil).toContain('2025')
  })
})

describe('hitungHariTerlambat()', () => {
  it('mengembalikan 0 jika tanggal kembali hari ini atau masa depan', () => {
    const besok = new Date()
    besok.setDate(besok.getDate() + 1)
    expect(hitungHariTerlambat(besok.toISOString())).toBe(0)
  })

  it('mengembalikan 0 jika tanggal tepat hari ini', () => {
    const hariIni = new Date()
    hariIni.setHours(23, 59, 59, 999)
    expect(hitungHariTerlambat(hariIni.toISOString())).toBe(0)
  })

  it('mengembalikan angka positif jika sudah terlambat', () => {
    const semingguLalu = new Date()
    semingguLalu.setDate(semingguLalu.getDate() - 7)
    const hari = hitungHariTerlambat(semingguLalu.toISOString())
    expect(hari).toBeGreaterThan(0)
  })

  it('mengembalikan angka yang tidak pernah negatif', () => {
    const masaDepan = new Date()
    masaDepan.setFullYear(masaDepan.getFullYear() + 1)
    expect(hitungHariTerlambat(masaDepan.toISOString())).toBeGreaterThanOrEqual(0)
  })
})

describe('potongTeks()', () => {
  it('mengembalikan string kosong jika input null', () => {
    expect(potongTeks(null)).toBe('')
  })

  it('tidak memotong teks yang lebih pendek dari batas', () => {
    expect(potongTeks('Halo', 10)).toBe('Halo')
  })

  it('memotong teks yang melebihi batas dan menambahkan ...', () => {
    const teks = 'Ini adalah teks yang sangat panjang'
    const hasil = potongTeks(teks, 10)
    expect(hasil).toContain('...')
    expect(hasil.length).toBeLessThanOrEqual(13) // 10 + 3 titik
  })

  it('menggunakan panjang default 100', () => {
    const teks = 'a'.repeat(150)
    const hasil = potongTeks(teks)
    expect(hasil.endsWith('...')).toBe(true)
  })
})
