// src/directives/vHighlight.js
// Direktif untuk menyorot kata yang cocok dengan query pencarian
// Digunakan di halaman Katalog untuk highlight hasil search

export const vHighlight = {
  // mounted: dipanggil saat elemen pertama kali dipasang
  mounted(el, binding) {
    highlight(el, binding.value)
  },
  // updated: dipanggil saat nilai binding berubah
  // Contoh: kata cari berubah dari 'vue' ke 'react'
  updated(el, binding) {
    // Hanya proses jika nilai berubah (optimasi performa)
    if (binding.value !== binding.oldValue) {
      highlight(el, binding.value)
    }
  },
}

// Fungsi helper — memisahkan logika agar mudah diuji
function highlight(el, query) {
  // Simpan teks asli agar bisa di-reset
  const teksAsli = el.dataset.originalText || el.textContent
  el.dataset.originalText = teksAsli

  if (!query || query.trim() === '') {
    // Jika tidak ada kata cari, tampilkan teks asli
    el.innerHTML = teksAsli
    return
  }

  // Escape karakter khusus regex untuk keamanan
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')

  // Ganti kata yang cocok dengan <mark> untuk highlight
  el.innerHTML = teksAsli.replace(
    regex,
    '<mark style="background:#FEF08A;border-radius:2px;">$1</mark>'
  )
}

// Penggunaan:
// <p v-highlight="kataCari">Vue.js adalah framework JavaScript modern</p>
// Jika kataCari = 'vue', 'Vue.js' akan di-highlight dengan warna kuning