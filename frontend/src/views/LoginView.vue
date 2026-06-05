<!-- frontend/src/views/LoginView.vue — Refaktor dengan VeeValidate -->
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
        <!-- Alert Error dari API -->
        <div
          v-if="apiError"
          class="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4 shrink-0" /> {{ apiError }}
        </div>

        <!-- Form dengan VeeValidate -->
        <Form :validation-schema="loginSchema" @submit="handleLogin" v-slot="{ errors, isSubmitting }">
          <div class="space-y-4">
            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Email</label>
              <Field name="email" type="email" v-slot="{ field, meta: fm }">
                <Input
                  v-bind="field"
                  placeholder="admin@siperpus.id"
                  :class="fm.touched && errors.email ? 'border-destructive' : ''"
                />
              </Field>
              <ErrorMessage name="email" class="text-xs text-destructive" />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Password</label>
              <Field
                name="password"
                :type="showPassword ? 'text' : 'password'"
                v-slot="{ field, meta: fm }"
              >
                <div class="relative">
                  <Input
                    v-bind="field"
                    placeholder="Masukkan password"
                    :class="fm.touched && errors.password ? 'border-destructive' : ''"
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
              </Field>
              <ErrorMessage name="password" class="text-xs text-destructive" />
            </div>

            <!-- Tombol Submit -->
            <Button type="submit" class="w-full" :disabled="isSubmitting">
              <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              {{ isSubmitting ? 'Memverifikasi...' : 'Masuk' }}
            </Button>
          </div>
        </Form>

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
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginSchema } from '@/schemas/authSchema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookOpenCheck, Eye, EyeOff, LoaderCircle, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const apiError = ref('')
const showPassword = ref(false)

async function handleLogin(values) {
  apiError.value = ''
  try {
    await authStore.login(values.email, values.password)
    // Redirect ke URL asal atau beranda
    router.push(route.query.redirect || '/')
  } catch (err) {
    apiError.value = err.response?.data?.message || err.message || 'Login gagal'
  }
}
</script>
