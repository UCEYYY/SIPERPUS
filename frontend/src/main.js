// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupGuards } from './router/guards'
import './assets/main.css' // ✅ Gunakan nama file CSS yang sudah kita buat sebelumnya

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
setupGuards(router) // ⚠️ Setup guards SETELAH pinia diaktifkan
app.use(router)
app.mount('#app')