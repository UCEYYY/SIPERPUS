<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center p-8">
    <h1 class="text-9xl font-black text-muted-foreground/30">404</h1>
    <h2 class="text-2xl font-bold mt-4">Halaman Tidak Ditemukan</h2>
    <p class="text-muted-foreground mt-2">Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
    <div class="flex gap-3 mt-6">
      <Button @click="router.go(-1)" variant="outline">
        <ArrowLeft class="mr-2 h-4 w-4" /> Kembali
      </Button>
      <Button as-child>
        <RouterLink to="/">
          <Home class="mr-2 h-4 w-4" /> Ke Beranda
        </RouterLink>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-vue-next'

const router = useRouter()
</script>