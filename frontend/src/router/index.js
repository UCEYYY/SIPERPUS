// src/router/index.js — konfigurasi lengkap SiPerpus
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // HALAMAN PUBLIK
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Beranda' },
    },
    {
      path: '/katalog',
      name: 'katalog',
      component: () => import('@/views/KatalogView.vue'),
      meta: { title: 'Katalog Buku' },
    },
    {
      path: '/katalog/:id',
      name: 'detail-buku',
      component: () => import('@/views/DetailBukuView.vue'),
      meta: { title: 'Detail Buku' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login', requiresGuest: true },
    },

    // DASHBOARD (NESTED ROUTES)
    {
      path: '/dashboard',
      component: () => import('@/components/layout/DashboardLayout.vue'),
      meta: { requiresAuth: true, role: 'pustakawan' },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardHomeView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'buku/tambah',
          name: 'tambah-buku',
          component: () => import('@/views/dashboard/TambahBukuView.vue'),
          meta: { title: 'Tambah Buku' },
        },
      ],
    },

    // CATCH-ALL 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Halaman Tidak Ditemukan' },
    },
  ],
  // Scroll ke atas setiap navigasi halaman
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
