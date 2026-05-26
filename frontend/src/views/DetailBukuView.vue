<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <RouterLink to="/" class="hover:text-foreground">Beranda</RouterLink>
      <span>/</span>
      <RouterLink to="/katalog" class="hover:text-foreground">Katalog</RouterLink>
      <span>/</span>
      <span class="text-foreground font-medium">{{ buku?.judul || 'Loading...' }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid md:grid-cols-3 gap-8">
      <Skeleton class="h-72 rounded-lg" />
      <div class="md:col-span-2 space-y-4">
        <Skeleton class="h-8 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
        <Skeleton class="h-20" />
      </div>
    </div>

    <!-- Buku Tidak Ditemukan -->
    <div v-else-if="!buku" class="text-center py-16">
      <BookX class="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      <h2 class="text-xl font-semibold">Buku tidak ditemukan</h2>
      <p class="text-muted-foreground mt-2">ID buku {{ route.params.id }} tidak ada dalam database.</p>
      <Button class="mt-4" variant="outline" @click="router.push('/katalog')">Kembali ke Katalog</Button>
    </div>

    <!-- Detail Buku -->
    <div v-else class="grid md:grid-cols-3 gap-8">
      <!-- Cover Placeholder -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center h-72 border">
        <BookOpen class="h-24 w-24 text-primary/40" />
      </div>

      <!-- Info Buku -->
      <div class="md:col-span-2 space-y-4">
        <div>
          <div class="flex items-start gap-3 mb-2">
            <h1 class="text-2xl font-bold flex-1">{{ buku.judul }}</h1>
            <Badge :variant="buku.tersedia ? 'default' : 'destructive'">
              {{ buku.tersedia ? 'Tersedia' : 'Dipinjam' }}
            </Badge>
          </div>
          <p class="text-lg text-muted-foreground">{{ buku.penulis }}</p>
        </div>

        <Separator />

        <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><span class="text-muted-foreground">Penerbit</span><p class="font-medium">{{ buku.penerbit }}</p></div>
          <div><span class="text-muted-foreground">Tahun Terbit</span><p class="font-medium">{{ buku.tahun }}</p></div>
          <div><span class="text-muted-foreground">Kategori</span><p><Badge variant="secondary">{{ buku.kategori }}</Badge></p></div>
          <div><span class="text-muted-foreground">ISBN</span><p class="font-medium font-mono">{{ buku.isbn }}</p></div>
        </div>

        <div v-if="buku.sinopsis">
          <h3 class="text-sm font-medium text-muted-foreground mb-1">Sinopsis</h3>
          <p class="text-sm leading-relaxed">{{ buku.sinopsis }}</p>
        </div>

        <div class="flex gap-3 pt-2">
          <template v-if="isLoggedIn">
            <Button :disabled="!buku.tersedia || isMemproses" @click="handlePinjam" class="flex-1">
              <LoaderCircle v-if="isMemproses" class="mr-2 h-4 w-4 animate-spin" />
              <BookMarked v-else class="mr-2 h-4 w-4" />
              {{ buku.tersedia ? 'Pinjam Buku Ini' : 'Sedang Dipinjam' }}
            </Button>
          </template>
          <template v-else>
            <Button class="flex-1" @click="goToLogin">
              <LogIn class="mr-2 h-4 w-4" /> Login untuk Meminjam
            </Button>
          </template>
          <Button variant="outline" @click="router.go(-1)">Kembali</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBukuStore } from '@/stores/buku'
import { useAuthStore } from '@/stores/auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, BookMarked, BookX, LogIn, LoaderCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const bukuStore = useBukuStore()
const authStore = useAuthStore()

const { isLoading } = storeToRefs(bukuStore)
const { isLoggedIn } = storeToRefs(authStore)
const isMemproses = ref(false)

const buku = computed(() => {
  const id = Number(route.params.id)
  return bukuStore.daftarBuku.find(b => b.id === id) || null
})

onMounted(async () => {
  if (bukuStore.daftarBuku.length === 0) {
    await bukuStore.ambilSemuaBuku()
  }
})

async function handlePinjam() {
  isMemproses.value = true
  await new Promise(r => setTimeout(r, 800)) // Simulasi network delay
  bukuStore.pinjamBuku(buku.value.id)
  isMemproses.value = false
}

function goToLogin() {
  router.push({ name: 'login', query: { redirect: route.fullPath } })
}
</script>