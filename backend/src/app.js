const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const bukuRoutes = require('./routes/buku.routes');
const anggotaRoutes = require('./routes/anggota.routes');
const peminjamanRoutes = require('./routes/peminjaman.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// MIDDLEWARE GLOBAL
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/anggota', anggotaRoutes);
app.use('/api/peminjaman', peminjamanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// Error handler (WAJIB di paling akhir)
app.use(errorHandler);

module.exports = app;