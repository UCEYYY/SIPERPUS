<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-card border-r flex flex-col shrink-0">
      <div class="p-4 border-b">
        <p class="font-bold text-lg text-primary">📚 SiPerpus</p>
        <p class="text-xs text-muted-foreground">Panel Pustakawan</p>
      </div>
      
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.name" 
          :to="{ name: item.name }"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          active-class="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-medium"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <!-- Konten Utama -->
    <main class="flex-1 overflow-auto bg-background">
      <div class="p-6 max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">{{ route.meta.title }}</h1>
          <p class="text-sm text-muted-foreground mt-1">Kelola perpustakaan secara terpusat</p>
        </div>
        
        <!-- Child routes dirender di sini -->
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, BookOpen, Users, BookMarked, BarChart3 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'kelola-buku', label: 'Kelola Buku', icon: BookOpen },
  { name: 'kelola-anggota', label: 'Kelola Anggota', icon: Users },
  { name: 'peminjaman', label: 'Peminjaman', icon: BookMarked },
  { name: 'laporan', label: 'Laporan', icon: BarChart3 },
].filter(item => router.hasRoute(item.name))
</script>