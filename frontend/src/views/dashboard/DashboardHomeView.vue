<template>
  <div class="space-y-6">
    <!-- Greeting -->
    <div>
      <h2 class="text-xl font-semibold">Selamat datang, {{ authStore.namaUser }}! 👋</h2>
      <p class="text-muted-foreground text-sm mt-1">Berikut ringkasan aktivitas perpustakaan hari ini.</p>
    </div>

    <!-- Kartu Statistik -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Total Buku</CardDescription>
          <CardTitle class="text-3xl">{{ statistik.total }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Tersedia</CardDescription>
          <CardTitle class="text-3xl text-green-600">{{ statistik.tersedia }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>Dipinjam</CardDescription>
          <CardTitle class="text-3xl text-orange-500">{{ statistik.dipinjam }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardDescription>% Tersedia</CardDescription>
          <CardTitle class="text-3xl text-blue-600">{{ statistik.persen }}%</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Akses Cepat -->
    <div class="grid gap-4 sm:grid-cols-2">
      <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="router.push({ name: 'tambah-buku' })">
        <CardContent class="flex items-center gap-4 p-6">
          <div class="p-3 bg-primary/10 rounded-lg">
            <BookPlus class="h-6 w-6 text-primary" />
          </div>
          <div>
            <p class="font-semibold">Tambah Buku Baru</p>
            <p class="text-sm text-muted-foreground">Daftarkan koleksi terbaru</p>
          </div>
        </CardContent>
      </Card>
      <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="router.push({ name: 'peminjaman' })">
        <CardContent class="flex items-center gap-4 p-6">
          <div class="p-3 bg-orange-50/50 rounded-lg">
            <BookMarked class="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p class="font-semibold">Proses Peminjaman</p>
            <p class="text-sm text-muted-foreground">Catat pinjam & kembali</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBukuStore } from '@/stores/buku'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookPlus, BookMarked } from 'lucide-vue-next'

const router = useRouter()
const bukuStore = useBukuStore()
const authStore = useAuthStore()
const { statistik } = storeToRefs(bukuStore)

onMounted(() => {
  if (bukuStore.daftarBuku.length === 0) {
    bukuStore.ambilSemuaBuku()
  }
})
</script>