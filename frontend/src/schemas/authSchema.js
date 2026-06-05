// frontend/src/schemas/authSchema.js
import * as Yup from 'yup'

export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email wajib diisi')
    .email('Format email tidak valid (contoh: nama@domain.com)'),
  password: Yup.string()
    .required('Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = Yup.object({
  nama: Yup.string().required('Nama lengkap wajib diisi').min(3, 'Nama minimal 3 karakter'),
  email: Yup.string().required('Email wajib diisi').email('Format email tidak valid'),
  password: Yup.string()
    .required('Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
  passwordKonfirmasi: Yup.string()
    .required('Konfirmasi password wajib diisi')
    .oneOf([Yup.ref('password')], 'Konfirmasi password tidak cocok'),
  nim: Yup.string()
    .optional()
    .matches(/^\d{8,12}$/, 'NIM harus berupa 8-12 digit angka'),
})
