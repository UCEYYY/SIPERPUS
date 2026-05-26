// src/directives/vFocus.js
// Direktif untuk otomatis fokus ke elemen input saat dipasang ke DOM

export const vFocus = {
  // mounted: dipanggil saat elemen selesai dipasang ke DOM
  mounted(el) {
    el.focus()
  }
}

// Penggunaan di komponen:
// <script setup>
// import { vFocus } from '@/directives/vFocus'
// </script>
// <template>
//   <input v-focus type="text" placeholder="Otomatis terfokus!" />
// </template>