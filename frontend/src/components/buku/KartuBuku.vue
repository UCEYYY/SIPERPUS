<template>
  <Card class="flex flex-col h-full hover:shadow-md transition-shadow">
    <CardHeader class="pb-2">
      <div class="flex items-start justify-between gap-2">
        <CardTitle class="text-base leading-tight line-clamp-2">{{ buku.judul }}</CardTitle>
        <Badge :variant="buku.tersedia ? 'default' : 'secondary'" class="shrink-0 text-xs">
          {{ buku.tersedia ? 'Tersedia' : 'Dipinjam' }}
        </Badge>
      </div>
      <CardDescription class="text-sm">{{ buku.penulis }}</CardDescription>
    </CardHeader>
    <CardContent class="flex-1 pb-2">
      <div class="text-xs text-muted-foreground space-y-1">
        <p class="flex items-center gap-1.5"><Tag class="h-3 w-3" /> {{ buku.kategori }}</p>
        <p class="flex items-center gap-1.5"><Building2 class="h-3 w-3" /> {{ buku.penerbit }}</p>
        <p class="flex items-center gap-1.5"><Calendar class="h-3 w-3" /> {{ buku.tahun }}</p>
      </div>
    </CardContent>
    <CardFooter class="gap-2 pt-2">
      <Button variant="outline" size="sm" class="flex-1" as-child>
        <RouterLink :to="`/katalog/${buku.id}`">Detail</RouterLink>
      </Button>
      <Button size="sm" class="flex-1" :disabled="!buku.tersedia" @click="$emit('pinjam', buku.id)">
        {{ buku.tersedia ? 'Pinjam' : 'Tidak Tersedia' }}
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup>
import { Tag, Building2, Calendar } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

defineProps({ buku: { type: Object, required: true } })
defineEmits(['lihat-detail', 'pinjam'])
</script>
