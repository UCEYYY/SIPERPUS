const pool = require('../config/database');
const { createError } = require('../middleware/errorHandler');

async function pinjamBuku(req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const { buku_id } = req.body;
    // Catatan: JWT di modul hanya menyimpan user.id. Kita ambil anggota_id dari DB
    const [[anggota]] = await conn.execute('SELECT id FROM anggota WHERE user_id = ?', [req.user.id]);
    if (!anggota) throw createError(403, 'User bukan anggota');
    const anggota_id = anggota.id;

    const [[buku]] = await conn.execute('SELECT id, judul, tersedia FROM buku WHERE id = ? FOR UPDATE', [buku_id]);
    if (!buku) throw createError(404, 'Buku tidak ditemukan');
    if (buku.tersedia <= 0) throw createError(400, 'Buku tidak tersedia');

    const [[existing]] = await conn.execute(
      `SELECT id FROM peminjaman WHERE anggota_id = ? AND buku_id = ? AND status = 'aktif'`,
      [anggota_id, buku_id]
    );
    if (existing) throw createError(400, 'Anda sudah meminjam buku ini');

    const tanggalKembali = new Date();
    tanggalKembali.setDate(tanggalKembali.getDate() + 14);

    const [result] = await conn.execute(
      `INSERT INTO peminjaman(anggota_id, buku_id, tanggal_kembali) VALUES(?,?,?)`,
      [anggota_id, buku_id, tanggalKembali.toISOString().split('T')[0]]
    );
    await conn.execute('UPDATE buku SET tersedia = tersedia - 1 WHERE id = ?', [buku_id]);

    await conn.commit();
    conn.release();

    res.status(201).json({
      success: true,
      message: `Buku '${buku.judul}' berhasil dipinjam`,
      data: { peminjamanId: result.insertId, tanggalKembali: tanggalKembali.toISOString().split('T')[0] }
    });
  } catch (err) { await conn.rollback(); conn.release(); next(err); }
}

async function kembalikanBuku(req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [[peminjaman]] = await conn.execute(
      `SELECT p.*, b.judul FROM peminjaman p JOIN buku b ON p.buku_id = b.id WHERE p.id = ? AND p.status = 'aktif'`,
      [req.params.id]
    );
    if (!peminjaman) throw createError(404, 'Data peminjaman tidak ditemukan');

    const today = new Date();
    const batas = new Date(peminjaman.tanggal_kembali);
    const terlambat = Math.max(0, Math.ceil((today - batas) / (1000 * 60 * 60 * 24)));
    const denda = terlambat * 1000;

    await conn.execute(
      `UPDATE peminjaman SET status='selesai', tanggal_dikembalikan=CURDATE(), denda=? WHERE id=?`,
      [denda, req.params.id]
    );
    await conn.execute('UPDATE buku SET tersedia = tersedia + 1 WHERE id = ?', [peminjaman.buku_id]);

    await conn.commit();
    conn.release();

    res.json({ success: true, message: 'Buku berhasil dikembalikan', data: { terlambatHari: terlambat, denda } });
  } catch (err) { await conn.rollback(); conn.release(); next(err); }
}

module.exports = { pinjamBuku, kembalikanBuku };