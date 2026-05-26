import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bukuService } from '@/services/bukuService'

// Data dummy untuk mode offline (tanpa backend)
const DUMMY_BUKU = [
  {
    id: 1,
    judul: 'Laskar Pelangi',
    penulis: 'Andrea Hirata',
    kategori: 'Novel',
    status: 'tersedia',
    tahun: 2005,
    stok: 3,
  },
  {
    id: 2,
    judul: 'Bumi Manusia',
    penulis: 'Pramoedya Ananta Toer',
    kategori: 'Novel',
    status: 'tersedia',
    tahun: 1980,
    stok: 2,
  },
  {
    id: 3,
    judul: 'Algoritma & Pemrograman',
    penulis: 'Rinaldi Munir',
    kategori: 'Teknologi',
    status: 'dipinjam',
    tahun: 2011,
    stok: 0,
  },
  {
    id: 4,
    judul: 'Sejarah Indonesia Modern',
    penulis: 'M.C. Ricklefs',
    kategori: 'Sejarah',
    status: 'tersedia',
    tahun: 2008,
    stok: 1,
  },
  {
    id: 5,
    judul: 'Atomic Habits',
    penulis: 'James Clear',
    kategori: 'Pengembangan Diri',
    status: 'tersedia',
    tahun: 2018,
    stok: 4,
  },
  {
    id: 6,
    judul: 'Clean Code',
    penulis: 'Robert C. Martin',
    kategori: 'Teknologi',
    status: 'dipinjam',
    tahun: 2008,
    stok: 0,
  },
  {
    id: 7,
    judul: 'Filosofi Teras',
    penulis: 'Henry Manampiring',
    kategori: 'Pengembangan Diri',
    status: 'tersedia',
    tahun: 2018,
    stok: 5,
  },
  {
    id: 8,
    judul: 'Negeri 5 Menara',
    penulis: 'Ahmad Fuadi',
    kategori: 'Novel',
    status: 'tersedia',
    tahun: 2009,
    stok: 2,
  },
]

export const useBukuStore = defineStore('buku', () => {
  const daftarBuku = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({ page: 1, limit: 12, total: 0 })
  const filter = ref({ search: '', kategori: '', status: 'semua' })

  const statistik = computed(() => {
    const total = daftarBuku.value.length
    const dipinjam = daftarBuku.value.filter((b) => b.status === 'dipinjam').length
    const tersedia = total - dipinjam
    const persen = total > 0 ? Math.round((tersedia / total) * 100) : 0
    return { total, tersedia, dipinjam, persen }
  })

  async function ambilSemuaBuku() {
    isLoading.value = true
    error.value = null
    try {
      const result = await bukuService.getAll({
        search: filter.value.search,
        kategori: filter.value.kategori,
        status: filter.value.status === 'semua' ? '' : filter.value.status,
        page: pagination.value.page,
        limit: pagination.value.limit,
      })
      daftarBuku.value = result.data.items
      pagination.value.total = result.data.pagination.total
    } catch (e) {
      // Jika backend tidak tersedia, gunakan data dummy
      const isNetworkError = !e.response
      if (isNetworkError) {
        daftarBuku.value = DUMMY_BUKU
        pagination.value.total = DUMMY_BUKU.length
      } else {
        error.value = e.response?.data?.message || e.message || 'Gagal memuat data'
      }
    } finally {
      isLoading.value = false
    }
  }

  async function tambahBuku(data) {
    try {
      const result = await bukuService.create(data)
      daftarBuku.value.unshift(result.data)
      return result.data
    } catch (e) {
      if (!e.response) {
        // Mode offline: tambah ke data lokal dengan id sementara
        const newBuku = { ...data, id: Date.now(), status: 'tersedia' }
        daftarBuku.value.unshift(newBuku)
        return newBuku
      }
      throw e
    }
  }

  async function hapusBuku(id) {
    try {
      await bukuService.remove(id)
    } catch (e) {
      if (e.response) throw e
      // Mode offline: lanjutkan hapus dari data lokal
    }
    daftarBuku.value = daftarBuku.value.filter((b) => b.id !== id)
  }

  return {
    daftarBuku,
    isLoading,
    error,
    pagination,
    filter,
    statistik,
    ambilSemuaBuku,
    tambahBuku,
    hapusBuku,
  }
})
