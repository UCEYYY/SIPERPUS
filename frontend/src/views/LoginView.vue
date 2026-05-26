<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div class="flex justify-center mb-3">
          <BookOpenCheck class="h-10 w-10 text-primary" />
        </div>
        <CardTitle class="text-2xl">Masuk ke SiPerpus</CardTitle>
        <CardDescription>Masukkan email dan password Anda</CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Alert Error -->
        <div
          v-if="errorMsg"
          class="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4 shrink-0" />
          {{ errorMsg }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Email</label>
            <Input
              v-model="form.email"
              type="email"
              placeholder="admin@siperpus.id"
              :disabled="isLoading"
            />
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Password</label>
            <div class="relative">
              <Input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                :disabled="isLoading"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Tombol Submit -->
          <Button type="submit" class="w-full" :disabled="isLoading">
            <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Memverifikasi...' : 'Masuk' }}
          </Button>
        </form>

        <!-- Hint Akun Demo -->
        <div class="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
          <p class="font-medium mb-1">Akun Demo:</p>
          <p>Pustakawan: admin@siperpus.id / admin123</p>
          <p>Anggota: siti@gmail.com / anggota123</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookOpenCheck, Eye, EyeOff, LoaderCircle, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const isLoading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

async function handleLogin() {
  if (!form.email || !form.password) {
    errorMsg.value = 'Email dan password harus diisi'
    return
  }
  isLoading.value = true
  errorMsg.value = ''
  try {
    await authStore.login(form.email, form.password)
    // Redirect ke URL asal atau beranda
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
