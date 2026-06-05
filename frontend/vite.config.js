import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Konfigurasi Vitest
  test: {
    // jsdom mensimulasikan browser environment untuk testing
    environment: 'jsdom',
    // Buat describe, it, expect, vi tersedia secara global tanpa import
    globals: true,
    // File setup yang dijalankan sebelum semua test
    setupFiles: ['./src/test/setup.js'],
    // File yang di-include sebagai test
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // Konfigurasi coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Hanya hitung coverage untuk file yang memang di-test
      include: [
        'src/composables/useApi.js',
        'src/utils/format.js',
        'src/schemas/bukuSchema.js',
        'src/schemas/authSchema.js',
        'src/components/buku/KartuBuku.vue',
      ],
    },
  },
})
