const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const bukuRoutes = require('./routes/buku.routes')
const anggotaRoutes = require('./routes/anggota.routes')
const peminjamanRoutes = require('./routes/peminjaman.routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

// ── MIDDLEWARE KEAMANAN ───────────────────────────────────────
app.use(helmet())

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
)

// ── MIDDLEWARE PERFORMA ───────────────────────────────────────

// Compression: kompres response (gzip) — hemat bandwidth
// Aktifkan untuk semua response > 1KB
app.use(
  compression({
    level: 6,        // Level kompresi 1-9 (6 = keseimbangan speed/ratio)
    threshold: 1024, // Hanya kompres response > 1KB
  }),
)

// Rate limiting global: 100 request per 15 menit per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100,                  // Maksimal 100 request
  message: {
    success: false,
    message: 'Terlalu banyak request. Coba lagi setelah 15 menit.',
  },
  standardHeaders: true, // Tambahkan RateLimit-* headers
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Rate limiting ketat untuk endpoint autentikasi
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Hanya 10 percobaan login per 15 menit
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Coba lagi setelah 15 menit.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/auth/login', authLimiter)

// ── MIDDLEWARE UMUM ───────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/buku', bukuRoutes)
app.use('/api/anggota', anggotaRoutes)
app.use('/api/peminjaman', peminjamanRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' })
})

// Error handler (WAJIB di paling akhir)
app.use(errorHandler)

module.exports = app
