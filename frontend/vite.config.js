import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    // Visualizer: buat file HTML interaktif setelah npm run build
    visualizer({
      open: false,            // Jangan buka otomatis (agar tidak ganggu CI)
      filename: 'dist/stats.html',
      gzipSize: true,         // Tampilkan ukuran setelah gzip
      brotliSize: true,       // Tampilkan ukuran setelah brotli
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Rollup options untuk code splitting
    rollupOptions: {
      output: {
        // manualChunks: pisahkan library besar ke chunk terpisah
        // Meningkatkan caching browser — jika library tidak berubah,
        // browser pakai cache lama meski app code berubah
        // manualChunks sebagai function (diperlukan oleh Vite 8 / Rolldown)
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia')) return 'vendor-vue'
            if (id.includes('vee-validate') || id.includes('yup')) return 'vendor-forms'
            if (id.includes('axios')) return 'vendor-axios'
            if (id.includes('lucide')) return 'vendor-icons'
            return 'vendor'
          }
        },
      },
    },
    // Ukuran chunk maksimal sebelum warning
    chunkSizeWarningLimit: 600,
    // Sourcemap di production (nonaktifkan untuk ukuran lebih kecil)
    sourcemap: false,
  },
  // Konfigurasi Vitest
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
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
