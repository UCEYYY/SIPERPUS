<!-- frontend/src/views/dashboard/TambahBukuView.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Tambah Buku Baru</h1>
      <p class="text-muted-foreground text-sm mt-1">Isi data buku dengan lengkap dan benar</p>
    </div>

    <!-- Alert error dari API -->
    <div
      v-if="apiError"
      class="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-sm text-destructive"
    >
      <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
      <div>
        <p class="font-medium">{{ apiError }}</p>
        <!-- Error detail per field dari backend -->
        <ul v-if="apiFieldErrors.length" class="mt-1 list-disc pl-4 space-y-0.5">
          <li v-for="e in apiFieldErrors" :key="e.field">
            <strong>{{ e.field }}:</strong> {{ e.message }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Form dengan VeeValidate -->
    <Form
      :validation-schema="bukuSchema"
      :initial-values="initialValues"
      @submit="onSubmit"
      v-slot="{ errors, isSubmitting, meta }"
    >
      <Card>
        <CardContent class="pt-6 space-y-5">
          <!-- Judul -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">
              Judul Buku <span class="text-destructive">*</span>
            </label>
            <Field name="judul" v-slot="{ field, meta: fm }">
              <Input
                v-bind="field"
                placeholder="Masukkan judul buku..."
                :class="fm.touched && errors.judul ? 'border-destructive' : ''"
              />
            </Field>
            <ErrorMessage
              name="judul"
              class="text-xs text-destructive flex items-center gap-1"
            />
          </div>

          <!-- Penulis -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">
              Penulis <span class="text-destructive">*</span>
            </label>
            <Field name="penulis" v-slot="{ field, meta: fm }">
              <Input
                v-bind="field"
                placeholder="Nama penulis"
                :class="fm.touched && errors.penulis ? 'border-destructive' : ''"
              />
            </Field>
            <ErrorMessage name="penulis" class="text-xs text-destructive" />
          </div>

          <!-- Grid: Penerbit + Tahun -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Penerbit</label>
              <Field name="penerbit" v-slot="{ field }">
                <Input v-bind="field" placeholder="Nama penerbit" />
              </Field>
              <ErrorMessage name="penerbit" class="text-xs text-destructive" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Tahun Terbit</label>
              <Field name="tahun" v-slot="{ field }">
                <Input
                  v-bind="field"
                  type="number"
                  :placeholder="String(new Date().getFullYear())"
                />
              </Field>
              <ErrorMessage name="tahun" class="text-xs text-destructive" />
            </div>
          </div>

          <!-- Grid: ISBN + Stok -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">ISBN</label>
              <Field name="isbn" v-slot="{ field }">
                <Input v-bind="field" placeholder="9780132350884" />
              </Field>
              <ErrorMessage name="isbn" class="text-xs text-destructive" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium">
                Stok <span class="text-destructive">*</span>
              </label>
              <Field name="stok" v-slot="{ field }">
                <Input v-bind="field" type="number" min="0" placeholder="0" />
              </Field>
              <ErrorMessage name="stok" class="text-xs text-destructive" />
            </div>
          </div>

          <!-- Kategori -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">
              Kategori <span class="text-destructive">*</span>
            </label>
            <Field name="kategori" v-slot="{ field }">
              <Select :model-value="field.value" @update:model-value="field.onChange">
                <SelectTrigger :class="errors.kategori ? 'border-destructive' : ''">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="k in kategoriList" :key="k" :value="k">
                    {{ k }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <ErrorMessage name="kategori" class="text-xs text-destructive" />
          </div>

          <!-- Sinopsis -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Sinopsis</label>
            <Field name="sinopsis" v-slot="{ field }">
              <textarea
                v-bind="field"
                rows="4"
                placeholder="Deskripsi singkat buku..."
                class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              ></textarea>
            </Field>
            <ErrorMessage name="sinopsis" class="text-xs text-destructive" />
          </div>

          <!-- Indikator validasi form -->
          <div
            v-if="meta.dirty"
            :class="[
              'text-xs flex items-center gap-1.5',
              meta.valid ? 'text-green-600' : 'text-destructive',
            ]"
          >
            <CheckCircle2 v-if="meta.valid" class="h-3.5 w-3.5" />
            <XCircle v-else class="h-3.5 w-3.5" />
            {{ meta.valid ? 'Semua field valid — siap disimpan' : 'Perbaiki error di atas' }}
          </div>
        </CardContent>

        <CardFooter class="justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            @click="router.push({ name: 'dashboard' })"
          >
            Batal
          </Button>
          <Button type="submit" :disabled="isSubmitting || !meta.valid">
            <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Buku' }}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useBukuStore } from '@/stores/buku'
import { bukuSchema } from '@/schemas/bukuSchema'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from 'lucide-vue-next'

const router = useRouter()
const bukuStore = useBukuStore()

// State untuk error dari API
const apiError = ref('')
const apiFieldErrors = ref([])

const initialValues = { stok: 1 }
const kategoriList = [
  'Fiksi',
  'NonFiksi',
  'Sains',
  'Teknologi',
  'Sejarah',
  'Bisnis',
  'Seni',
  'Novel',
  'Pengembangan Diri',
]

async function onSubmit(values, { setErrors }) {
  apiError.value = ''
  apiFieldErrors.value = []
  try {
    await bukuStore.tambahBuku(values)
    router.push({ name: 'dashboard' })
  } catch (err) {
    const response = err.response?.data
    if (response?.errors) {
      // Error validasi dari backend — set ke VeeValidate per field
      const fieldErrors = {}
      response.errors.forEach((e) => {
        fieldErrors[e.field] = e.message
      })
      setErrors(fieldErrors)
      apiFieldErrors.value = response.errors
    }
    apiError.value = response?.message || err.message || 'Gagal menyimpan buku'
  }
}
</script>
