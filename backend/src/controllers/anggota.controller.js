const pool = require('../config/database');
const { createError } = require('../middleware/errorHandler');

async function getAll(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT a.id, u.nama, u.email, a.nim, a.program_studi, u.aktif
       FROM anggota a
       JOIN users u ON a.user_id = u.id
       ORDER BY u.nama ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const [[anggota]] = await pool.execute(
      `SELECT a.id, u.nama, u.email, a.nim, a.program_studi, u.aktif
       FROM anggota a
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (!anggota) throw createError(404, 'Anggota tidak ditemukan');
    res.json({ success: true, data: anggota });
  } catch (err) { next(err); }
}

async function getRiwayat(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id, b.judul, b.penulis, p.tanggal_pinjam, p.tanggal_kembali,
              p.tanggal_dikembalikan, p.status, p.denda
       FROM peminjaman p
       JOIN buku b ON p.buku_id = b.id
       JOIN anggota a ON p.anggota_id = a.id
       WHERE a.id = ?
       ORDER BY p.tanggal_pinjam DESC`,
      [req.params.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, getRiwayat };
