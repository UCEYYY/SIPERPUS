const pool = require('../config/database');
const { createError } = require('../middleware/errorHandler');

async function getAll(req, res, next) {
  try {
    const { search = '', kategori = '', status = '', page = 1, limit = 12 } = req.query;
    let where = 'WHERE 1=1';
    const params = [];

    if (search) { where += ' AND (judul LIKE ? OR penulis LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (kategori) { where += ' AND kategori = ?'; params.push(kategori); }
    if (status === 'tersedia') { where += ' AND tersedia > 0'; }
    else if (status === 'dipinjam') { where += ' AND tersedia = 0'; }

    const [countRows] = await pool.execute(`SELECT COUNT(*) as total FROM buku ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(limit);

    const [rows] = await pool.execute(
      `SELECT * FROM buku ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    res.json({
      success: true,
      data: {
        items: rows,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) }
      }
    });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM buku WHERE id = ?', [req.params.id]);
    if (rows.length === 0) throw createError(404, 'Buku tidak ditemukan');
    res.json({ success: true, data: rows[0] });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO buku(judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok, tersedia) VALUES(?,?,?,?,?,?,?,?,?)`,
      [judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok, stok]
    );
    const [newBuku] = await pool.execute('SELECT * FROM buku WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Buku berhasil ditambahkan', data: newBuku[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return next(createError(409, 'ISBN sudah digunakan'));
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok } = req.body;
    const [existing] = await pool.execute('SELECT * FROM buku WHERE id = ?', [req.params.id]);
    if (existing.length === 0) throw createError(404, 'Buku tidak ditemukan');

    await pool.execute(
      `UPDATE buku SET judul=?, penulis=?, penerbit=?, tahun=?, isbn=?, kategori=?, sinopsis=?, stok=? WHERE id=?`,
      [judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok, req.params.id]
    );
    const [updated] = await pool.execute('SELECT * FROM buku WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Buku berhasil diperbarui', data: updated[0] });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const [existing] = await pool.execute('SELECT id FROM buku WHERE id = ?', [req.params.id]);
    if (existing.length === 0) throw createError(404, 'Buku tidak ditemukan');
    await pool.execute('DELETE FROM buku WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Buku berhasil dihapus' });
  } catch (err) { next(err); }
}

async function getStatistik(req, res, next) {
  try {
    const [[total]] = await pool.execute('SELECT COUNT(*) as n FROM buku');
    const [[tersedia]] = await pool.execute('SELECT SUM(tersedia) as n FROM buku');
    const [[dipinjam]] = await pool.execute("SELECT COUNT(*) as n FROM peminjaman WHERE status='aktif'");
    res.json({
      success: true,
      data: { totalBuku: total.n, bukuTersedia: tersedia.n || 0, peminjamanAktif: dipinjam.n }
    });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, update, remove, getStatistik };