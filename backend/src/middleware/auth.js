const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { createError } = require('./errorHandler');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Akses ditolak: token tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.execute(
      'SELECT id, nama, email, role, aktif FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0 || !rows[0].aktif) {
      throw createError(401, 'User tidak ditemukan atau tidak aktif');
    }

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return next(createError(401, 'Token tidak valid'));
    if (err.name === 'TokenExpiredError') return next(createError(401, 'Token sudah kedaluwarsa, silakan login ulang'));
    next(err);
  }
}

function requirePustakawan(req, res, next) {
  if (req.user?.role !== 'pustakawan') {
    return next(createError(403, 'Akses ditolak: hanya untuk pustakawan'));
  }
  next();
}

module.exports = { protect, requirePustakawan };