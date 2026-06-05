// frontend/src/composables/__tests__/useApi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '../useApi'

describe('useApi composable', () => {
  describe('state awal', () => {
    it('isLoading dimulai sebagai false', () => {
      const { isLoading } = useApi()
      expect(isLoading.value).toBe(false)
    })

    it('error dimulai sebagai null', () => {
      const { error } = useApi()
      expect(error.value).toBeNull()
    })
  })

  describe('execute() — API call berhasil', () => {
    it('mengatur isLoading true selama request berlangsung', async () => {
      let resolvePromise
      const apiFn = vi.fn(() => new Promise((r) => { resolvePromise = r }))
      const { isLoading, execute } = useApi()

      const executePromise = execute(apiFn)
      // Saat masih pending:
      expect(isLoading.value).toBe(true)

      resolvePromise({ data: [] })
      await executePromise
      // Setelah selesai:
      expect(isLoading.value).toBe(false)
    })

    it('mengembalikan data dari fungsi API', async () => {
      const mockData = { id: 1, judul: 'Clean Code' }
      const apiFn = vi.fn().mockResolvedValue({ data: { data: mockData } })
      const { execute } = useApi()

      const result = await execute(apiFn)
      expect(apiFn).toHaveBeenCalledOnce()
      expect(result).toEqual({ data: { data: mockData } })
    })

    it('meneruskan argumen ke fungsi API', async () => {
      const apiFn = vi.fn().mockResolvedValue({})
      const { execute } = useApi()

      await execute(apiFn, 42, 'param2')
      expect(apiFn).toHaveBeenCalledWith(42, 'param2')
    })

    it('error tetap null setelah call berhasil', async () => {
      const apiFn = vi.fn().mockResolvedValue({ data: 'ok' })
      const { error, execute } = useApi()

      await execute(apiFn)
      expect(error.value).toBeNull()
    })
  })

  describe('execute() — API call gagal', () => {
    it('mengatur error.value dari pesan error Axios', async () => {
      const axiosError = {
        response: { data: { message: 'Buku tidak ditemukan' } },
      }
      const apiFn = vi.fn().mockRejectedValue(axiosError)
      const { error, execute } = useApi()

      await execute(apiFn).catch(() => {}) // Tangkap re-throw
      expect(error.value).toBe('Buku tidak ditemukan')
    })

    it('fallback ke err.message jika tidak ada response', async () => {
      const networkError = new Error('Network Error')
      const apiFn = vi.fn().mockRejectedValue(networkError)
      const { error, execute } = useApi()

      await execute(apiFn).catch(() => {})
      expect(error.value).toBe('Network Error')
    })

    it('isLoading kembali false meski API gagal', async () => {
      const apiFn = vi.fn().mockRejectedValue(new Error('Gagal'))
      const { isLoading, execute } = useApi()

      await execute(apiFn).catch(() => {})
      expect(isLoading.value).toBe(false)
    })

    it('clearError() mengosongkan error', async () => {
      const apiFn = vi.fn().mockRejectedValue(new Error('Error'))
      const { error, execute, clearError } = useApi()

      await execute(apiFn).catch(() => {})
      expect(error.value).not.toBeNull()

      clearError()
      expect(error.value).toBeNull()
    })

    it('melempar error kembali setelah menyimpan pesan', async () => {
      const apiFn = vi.fn().mockRejectedValue(new Error('Gagal koneksi'))
      const { execute } = useApi()

      await expect(execute(apiFn)).rejects.toThrow('Gagal koneksi')
    })
  })
})
