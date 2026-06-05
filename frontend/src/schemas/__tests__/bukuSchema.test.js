// frontend/src/schemas/__tests__/bukuSchema.test.js
import { describe, it, expect } from 'vitest'
import { bukuSchema } from '../bukuSchema'

describe('bukuSchema validasi', () => {
  it('valid jika semua field wajib terisi dengan benar', async () => {
    const data = {
      judul: 'Clean Code',
      penulis: 'Robert Martin',
      kategori: 'Teknologi',
      stok: 3,
    }
    await expect(bukuSchema.validate(data)).resolves.toBeDefined()
  })

  it('gagal jika judul kosong', async () => {
    const data = { judul: '', penulis: 'Penulis', kategori: 'Fiksi', stok: 1 }
    await expect(bukuSchema.validate(data)).rejects.toThrow('wajib diisi')
  })

  it('gagal jika judul kurang dari 3 karakter', async () => {
    const data = { judul: 'AB', penulis: 'Penulis', kategori: 'Fiksi', stok: 1 }
    await expect(bukuSchema.validate(data)).rejects.toThrow('minimal 3 karakter')
  })

  it('gagal jika ISBN format tidak valid', async () => {
    const data = {
      judul: 'Judul',
      penulis: 'Penulis',
      kategori: 'Fiksi',
      stok: 1,
      isbn: '123456',
    }
    await expect(bukuSchema.validate(data)).rejects.toThrow('ISBN')
  })

  it('berhasil jika ISBN tidak diisi (opsional)', async () => {
    const data = { judul: 'Judul Buku', penulis: 'Penulis Valid', kategori: 'Fiksi', stok: 2 }
    await expect(bukuSchema.validate(data)).resolves.toBeDefined()
  })

  it('berhasil dengan ISBN yang valid (diawali 978)', async () => {
    const data = {
      judul: 'Judul Buku',
      penulis: 'Penulis Valid',
      kategori: 'Fiksi',
      stok: 2,
      isbn: '9780132350884',
    }
    await expect(bukuSchema.validate(data)).resolves.toBeDefined()
  })

  it('gagal jika stok negatif', async () => {
    const data = { judul: 'Judul Buku', penulis: 'Penulis', kategori: 'Fiksi', stok: -1 }
    await expect(bukuSchema.validate(data)).rejects.toThrow('negatif')
  })

  it('gagal jika kategori tidak diisi', async () => {
    const data = { judul: 'Judul Buku', penulis: 'Penulis Valid', stok: 2 }
    await expect(bukuSchema.validate(data)).rejects.toThrow('wajib')
  })

  it('gagal jika penulis kurang dari 3 karakter', async () => {
    const data = { judul: 'Judul Buku', penulis: 'AB', kategori: 'Fiksi', stok: 1 }
    await expect(bukuSchema.validate(data)).rejects.toThrow('minimal 3 karakter')
  })

  it('berhasil dengan semua field diisi termasuk opsional', async () => {
    const data = {
      judul: 'Laskar Pelangi',
      penulis: 'Andrea Hirata',
      penerbit: 'Bentang Pustaka',
      tahun: 2005,
      kategori: 'Novel',
      stok: 5,
      sinopsis: 'Novel tentang persahabatan anak-anak di Belitung.',
    }
    await expect(bukuSchema.validate(data)).resolves.toBeDefined()
  })

  it('gagal jika tahun terlalu lama (sebelum 1800)', async () => {
    const data = { judul: 'Judul', penulis: 'Penulis', kategori: 'Fiksi', stok: 1, tahun: 1799 }
    await expect(bukuSchema.validate(data)).rejects.toThrow('1800')
  })
})
