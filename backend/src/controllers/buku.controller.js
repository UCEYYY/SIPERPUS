const pool = require('../config/database')
const { createError } = require('../middleware/errorHandler')

// GET /api/buku — list semua buku dengan filter, pagination
// OPTIMASI: query COUNT dan data dijalankan PARALEL dengan Promise.all
async function getAll(req, res, next) {
  try {
    const { search = '', kategori = '', status = '', page = 1, limit = 12 } = req.query
    let where = 'WHERE 1=1'
    const params = []

    if (search) {
      where += ' AND (judul LIKE ? OR penulis LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    if (kategori) { where += ' AND kategori = ?'; params.push(kategori) }
    if (status === 'tersedia') where += ' AND tersedia > 0'
    else if (status === 'dipinjam') where += ' AND tersedia = 0'

    const offset = (Number(page) - 1) * Number(limit)

    // OPTIMASI: Hitung total dan ambil data secara PARALEL
    // Promise.all: kedua query berjalan bersamaan, hemat waktu
    const [countResult, dataResult] = await Promise.all([
      pool.execute(`SELECT COUNT(*) as total FROM buku ${where}`, params),
      pool.execute(
        // OPTIMASI: Pilih kolom yang diperlukan saja, bukan SELECT *
        `SELECT id, judul, penulis, kategori, tahun, isbn,
                tersedia, stok, cover_url, penerbit
         FROM buku ${where}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), offset],
      ),
    ])

    const total = countResult[0][0].total
    const rows = dataResult[0]

    // HTTP Caching: cache list buku 60 detik (data bisa berubah)
    // stale-while-revalidate=30: tampilkan cache lama sambil fetch baru
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30')

    res.json({
      success: true,
      data: {
        items: rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM buku WHERE id = ?', [req.params.id])
    if (rows.length === 0) throw createError(404, 'Buku tidak ditemukan')
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const { judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok } = req.body
    const [result] = await pool.execute(
      `INSERT INTO buku(judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok, tersedia)
       VALUES(?,?,?,?,?,?,?,?,?)`,
      [judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok, stok],
    )
    const [newBuku] = await pool.execute('SELECT * FROM buku WHERE id = ?', [result.insertId])
    res.status(201).json({
      success: true,
      message: 'Buku berhasil ditambahkan',
      data: newBuku[0],
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return next(createError(409, 'ISBN sudah digunakan'))
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const { judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok } = req.body
    const [existing] = await pool.execute('SELECT * FROM buku WHERE id = ?', [req.params.id])
    if (existing.length === 0) throw createError(404, 'Buku tidak ditemukan')

    await pool.execute(
      `UPDATE buku SET judul=?, penulis=?, penerbit=?, tahun=?, isbn=?,
       kategori=?, sinopsis=?, stok=? WHERE id=?`,
      [judul, penulis, penerbit, tahun, isbn, kategori, sinopsis, stok, req.params.id],
    )
    const [updated] = await pool.execute('SELECT * FROM buku WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'Buku berhasil diperbarui', data: updated[0] })
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const [existing] = await pool.execute('SELECT id FROM buku WHERE id = ?', [req.params.id])
    if (existing.length === 0) throw createError(404, 'Buku tidak ditemukan')
    await pool.execute('DELETE FROM buku WHERE id = ?', [req.params.id])
    res.json({ success: true, message: 'Buku berhasil dihapus' })
  } catch (err) {
    next(err)
  }
}

// GET /api/buku/statistik
// OPTIMASI: cache lebih lama karena statistik tidak sering berubah
async function getStatistik(req, res, next) {
  try {
    // Jalankan semua query statistik secara paralel
    const [totalResult, tersediaResult, dipinjamResult] = await Promise.all([
      pool.execute('SELECT COUNT(*) as n FROM buku'),
      pool.execute('SELECT SUM(tersedia) as n FROM buku'),
      pool.execute("SELECT COUNT(*) as n FROM peminjaman WHERE status='aktif'"),
    ])

    // HTTP Caching: statistik di-cache 5 menit
    res.set('Cache-Control', 'public, max-age=300')

    res.json({
      success: true,
      data: {
        totalBuku: totalResult[0][0].n,
        bukuTersedia: tersediaResult[0][0].n || 0,
        peminjamanAktif: dipinjamResult[0][0].n,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove, getStatistik }
