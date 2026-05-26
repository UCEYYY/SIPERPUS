<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- HEADER -->
      <div class="mb-8">
        <Badge variant="outline" class="mb-2">📚 Katalog Buku</Badge>
        <h1 class="text-4xl font-extrabold tracking-tight text-foreground mb-2">
          Jelajahi Koleksi Buku
        </h1>
        <p class="text-muted-foreground">{{ infoHasil }}</p>
      </div>

      <!-- TOOLBAR -->
      <div class="bg-card border border-border rounded-xl p-4 mb-8 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div class="relative flex-1">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model.trim="kataCari"
              type="text"
              placeholder="Cari judul atau penulis..."
              class="pl-10"
            />
          </div>
          <Select v-model="filterKategori">
            <SelectTrigger class="w-full lg:w-[200px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kategori</SelectItem>
              <SelectItem v-for="kat in daftarKategori" :key="kat" :value="kat">{{
                kat
              }}</SelectItem>
            </SelectContent>
          </Select>
          <div class="inline-flex items-center gap-1 bg-muted p-1 rounded-lg">
            <button
              v-for="s in statusOptions"
              :key="s.value"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                filterStatus === s.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="filterStatus = s.value"
            >
              {{ s.label }}
            </button>
          </div>
          <Button variant="outline" size="sm" @click="resetFilter">
            <RotateCcw class="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <!-- DATA LIST -->
      <DataList
        :items="bukuTerfilter"
        :is-loading="isLoading"
        grid-class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <template #default="{ item: buku }">
          <KartuBuku :buku="buku" @pinjam="bukuStore.pinjam" />
        </template>
        <template #empty>
          <div class="col-span-full text-center py-16">
            <p class="text-lg font-medium text-foreground mb-1">Tidak ada buku ditemukan</p>
            <p class="text-muted-foreground mb-4">Coba ubah kata pencarian atau filter</p>
            <Button variant="outline" @click="resetFilter">
              <RotateCcw class="mr-2 h-4 w-4" /> Reset Filter
            </Button>
          </div>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useBukuStore } from '@/stores/buku'
import DataList from '@/components/ui/DataList.vue'
import KartuBuku from '@/components/buku/KartuBuku.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, RotateCcw } from 'lucide-vue-next'

const bukuStore = useBukuStore()
const { daftarBuku } = storeToRefs(bukuStore)

onMounted(() => {
  if (daftarBuku.value.length === 0) {
    bukuStore.ambilSemuaBuku()
  }
})

const kataCari = ref('')
const filterKategori = ref('semua')
const filterStatus = ref('semua')
const isLoading = ref(false)

const statusOptions = [
  { label: 'Semua', value: 'semua' },
  { label: 'Tersedia', value: 'tersedia' },
  { label: 'Dipinjam', value: 'dipinjam' },
]

const daftarKategori = computed(() => [...new Set(daftarBuku.value.map((b) => b.kategori))].sort())

const bukuTerfilter = computed(() =>
  daftarBuku.value.filter((buku) => {
    const q = kataCari.value.toLowerCase()
    const cocokCari =
      !q || buku.judul.toLowerCase().includes(q) || buku.penulis.toLowerCase().includes(q)
    const cocokKategori = filterKategori.value === 'semua' || buku.kategori === filterKategori.value
    const cocokStatus =
      filterStatus.value === 'semua' ||
      (filterStatus.value === 'tersedia' && buku.tersedia) ||
      (filterStatus.value === 'dipinjam' && !buku.tersedia)
    return cocokCari && cocokKategori && cocokStatus
  }),
)

const infoHasil = computed(() => {
  const total = daftarBuku.value.length
  const terfilter = bukuTerfilter.value.length
  if (kataCari.value || filterKategori.value !== 'semua' || filterStatus.value !== 'semua') {
    return `Menampilkan ${terfilter} dari ${total} buku`
  }
  return `Total ${total} buku dalam koleksi`
})

function resetFilter() {
  kataCari.value = ''
  filterKategori.value = 'semua'
  filterStatus.value = 'semua'
}
</script>
