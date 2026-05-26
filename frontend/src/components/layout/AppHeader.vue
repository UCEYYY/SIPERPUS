<template>
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
    <div class="container mx-auto px-4 max-w-7xl">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl">
          <Library class="h-6 w-6 text-primary" />
          <span class="text-primary">SiPerpus</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            active-class="bg-accent text-accent-foreground"
            class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <ThemeSwitcher />
          <Button size="sm" as-child>
            <RouterLink to="/">Masuk</RouterLink>
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Home, BookOpen, Library } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'

const navItems = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/katalog', label: 'Katalog', icon: BookOpen },
]
</script>
