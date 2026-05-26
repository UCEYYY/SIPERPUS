// src/router/guards.js
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router) {
  // beforeEach: dijalankan sebelum SETIAP navigasi
  router.beforeEach((to, from) => {
    // Update title tab browser
    document.title = to.meta.title ? `${to.meta.title} — SiPerpus` : 'SiPerpus'

    const auth = useAuthStore()

    // SKENARIO 1: Halaman butuh autentikasi, user belum login
    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // SKENARIO 2: Halaman hanya untuk tamu, user sudah login
    if (to.meta.requiresGuest && auth.isLoggedIn) {
      return auth.isPustakawan ? { name: 'dashboard' } : { name: 'home' }
    }

    // SKENARIO 3: Halaman butuh role pustakawan
    if (to.meta.role === 'pustakawan' && !auth.isPustakawan) {
      return { name: 'home' }
    }

    // Lanjutkan navigasi normal
    return true
  })

  // afterEach: dijalankan setelah navigasi selesai
  router.afterEach((to) => {
    console.log(`[Router] Navigasi ke: ${to.fullPath}`)
  })
}
