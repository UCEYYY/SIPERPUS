<template>
  <div class="min-h-screen">
    <!-- HERO -->
    <section class="bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <div class="container mx-auto px-4 py-20 text-center">
        <Badge variant="outline" class="mb-4 gap-1.5">
          <BookMarked class="h-3 w-3" /> Sistem Perpustakaan Digital
        </Badge>
        <h1 class="text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Selamat Datang di <span class="text-primary">SiPerpus</span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Kelola koleksi buku, anggota, dan peminjaman dalam satu platform modern.
        </p>
        <div class="flex gap-3 justify-center flex-wrap">
          <Button size="lg" as-child>
            <RouterLink to="/katalog">
              <BookOpen class="mr-2 h-5 w-5" /> Jelajahi Katalog
            </RouterLink>
          </Button>
          <Button size="lg" variant="outline" as-child>
            <RouterLink to="/">Masuk Akun</RouterLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- STATISTIK -->
    <section class="container mx-auto px-4 py-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold">Statistik Perpustakaan</h2>
        <p class="text-muted-foreground mt-2">Data koleksi real-time</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="item in kartuStat" :key="item.id" class="relative overflow-hidden">
          <CardHeader class="pb-2">
            <CardDescription>{{ item.label }}</CardDescription>
            <CardTitle class="text-3xl font-extrabold">{{ item.nilai }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p v-if="item.sub" class="text-xs text-muted-foreground">{{ item.sub }}</p>
          </CardContent>
          <div class="absolute right-4 top-4 opacity-10">
            <component :is="item.icon" class="h-16 w-16" />
          </div>
        </Card>
      </div>
    </section>

    <!-- DEMO REAKTIVITAS -->
    <section class="container mx-auto px-4 pb-16">
      <Card class="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Demo Reaktivitas Vue.js 3</CardTitle>
          <CardDescription
            >Gunakan counter dan perhatikan statistik berubah otomatis</CardDescription
          >
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex gap-8 justify-center">
            <div class="text-center">
              <p class="text-sm text-muted-foreground mb-2">Total Buku</p>
              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  @click="stat.totalBuku--"
                  :disabled="stat.totalBuku <= 0"
                  >−</Button
                >
                <span class="text-2xl font-bold w-16 text-center">{{ stat.totalBuku }}</span>
                <Button variant="outline" size="icon" @click="stat.totalBuku++">+</Button>
              </div>
            </div>
            <div class="text-center">
              <p class="text-sm text-muted-foreground mb-2">Peminjaman Aktif</p>
              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  @click="kurangi"
                  :disabled="stat.peminjamanAktif <= 0"
                  >−</Button
                >
                <span class="text-2xl font-bold w-16 text-center">{{ stat.peminjamanAktif }}</span>
                <Button variant="outline" size="icon" @click="tambah">+</Button>
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-sm text-muted-foreground">
              <span>Buku Tersedia</span>
              <span>{{ bukuTersedia }} ({{ persenTersedia }})</span>
            </div>
            <div class="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-500"
                :style="{ width: persenTersedia }"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, BookMarked, BookCopy, BookCheck, Users } from 'lucide-vue-next'

const stat = reactive({ totalBuku: 1247, totalAnggota: 328, peminjamanAktif: 89 })
const bukuTersedia = computed(() => stat.totalBuku - stat.peminjamanAktif)
const persenTersedia = computed(() => {
  if (!stat.totalBuku) return '0%'
  return ((bukuTersedia.value / stat.totalBuku) * 100).toFixed(1) + '%'
})
const kartuStat = computed(() => [
  { id: 'buku', icon: BookCopy, label: 'Total Buku', nilai: stat.totalBuku, sub: null },
  { id: 'anggota', icon: Users, label: 'Anggota Aktif', nilai: stat.totalAnggota, sub: null },
  { id: 'pinjam', icon: BookOpen, label: 'Dipinjam', nilai: stat.peminjamanAktif, sub: null },
  {
    id: 'tersedia',
    icon: BookCheck,
    label: 'Buku Tersedia',
    nilai: bukuTersedia.value,
    sub: persenTersedia.value,
  },
])
function tambah() {
  if (stat.peminjamanAktif < stat.totalBuku) stat.peminjamanAktif++
}
function kurangi() {
  if (stat.peminjamanAktif > 0) stat.peminjamanAktif--
}
</script>
