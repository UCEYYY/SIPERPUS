<template>
  <div id="app">
    <!-- Modern Navbar Header -->
    <header class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo & Brand -->
          <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl text-foreground hover:opacity-80 transition-opacity">
            <span class="text-2xl">📚</span>
            <span class="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">SiPerpus</span>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              active-class="bg-accent text-accent-foreground"
              class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </RouterLink>
            <!-- Link Dashboard (Hanya muncul jika role = pustakawan) -->
            <RouterLink
              v-if="isPustakawan"
              to="/dashboard"
              class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <LayoutDashboard class="h-4 w-4" /> Dashboard
            </RouterLink>
          </nav>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center gap-2">
            <ThemeSwitcher />

            <!-- STATE: TAMU (Belum Login) -->
            <template v-if="!isLoggedIn">
              <Button variant="ghost" size="icon" as-child>
                <RouterLink to="/login"><LogIn class="h-4 w-4" /></RouterLink>
              </Button>
              <Button size="sm" as-child>
                <RouterLink to="/register"><UserPlus class="mr-2 h-4 w-4" /> Daftar</RouterLink>
              </Button>
            </template>

            <!-- STATE: SUDAH LOGIN (Avatar Dropdown) -->
            <DropdownMenu v-else>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="rounded-full">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback class="bg-primary text-primary-foreground text-xs font-medium">
                      {{ inisialUser }}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel class="font-normal">
                  <p class="text-sm font-medium leading-none">{{ namaUser }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ user?.email }}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <RouterLink to="/profil"><DropdownMenuItem><User class="mr-2 h-4 w-4" />Profil Saya</DropdownMenuItem></RouterLink>
                <DropdownMenuItem @click="handleLogout" class="text-destructive focus:text-destructive">
                  <LogOut class="mr-2 h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Mobile Menu Toggle -->
            <Button variant="ghost" size="icon" class="md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
              <Menu v-if="!isMobileMenuOpen" class="h-5 w-5" />
              <X v-else class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden border-t border-border bg-background">
        <nav class="container mx-auto px-4 py-4 space-y-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            active-class="bg-accent text-accent-foreground"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent/50"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </RouterLink>
          <RouterLink
            v-if="isPustakawan"
            to="/dashboard"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-accent/50"
            @click="isMobileMenuOpen = false"
          >
            <LayoutDashboard class="h-5 w-5" /> Dashboard
          </RouterLink>

          <Separator class="my-2" />

          <div class="space-y-2 pt-2">
            <template v-if="!isLoggedIn">
              <Button variant="outline" class="w-full" as-child><RouterLink to="/login"><LogIn class="mr-2 h-4 w-4" /> Masuk</RouterLink></Button>
              <Button class="w-full" as-child><RouterLink to="/register"><UserPlus class="mr-2 h-4 w-4" /> Daftar</RouterLink></Button>
            </template>
            <template v-else>
              <div class="px-3 py-2 text-sm font-medium">{{ namaUser }}</div>
              <Button variant="outline" class="w-full text-destructive" @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" /> Keluar
              </Button>
            </template>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher.vue'
import { Home, BookOpen, LogIn, UserPlus, Menu, X, LayoutDashboard, User, LogOut } from 'lucide-vue-next'

const router = useRouter()
const isMobileMenuOpen = ref(false)

// 📦 AMBIL STATE DARI AUTH STORE (Reaktif)
const authStore = useAuthStore()
const { isLoggedIn, isPustakawan, namaUser, inisialUser, user } = storeToRefs(authStore)

const navItems = [
  { path: '/', label: 'Beranda', icon: Home },
  { path: '/katalog', label: 'Katalog', icon: BookOpen },
]

// 🔐 LOGOUT
function handleLogout() {
  authStore.logout()
  isMobileMenuOpen.value = false // Tutup mobile menu jika terbuka
  router.push({ name: 'home' })
}
</script>

<style>
#app { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
</style>