<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" :class="['grid gap-4', gridClass]">
      <div v-for="n in 8" :key="n">
        <Skeleton class="h-48 w-full rounded-xl" />
      </div>
    </div>

    <!-- Data -->
    <div v-else-if="items.length > 0" :class="['grid gap-4', gridClass]">
      <slot v-for="item in items" :item="item" />
    </div>

    <!-- Empty State -->
    <div v-else>
      <slot name="empty">
        <div class="text-center py-16 text-muted-foreground">Tidak ada data ditemukan.</div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { Skeleton } from '@/components/ui/skeleton'

defineProps({
  items: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  gridClass: { type: String, default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
})
</script>
