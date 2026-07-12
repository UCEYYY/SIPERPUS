const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { createError } = require('../middleware/errorHandler');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND aktif = TRUE', [email]);

    if (rows.length === 0) throw createError(401, 'Email atau password salah');
    const user = rows[0];

    const passwordCocok = await bcrypt.compare(password, user.password);
    if (!passwordCocok) throw createError(401, 'Email atau password salah');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: { id: user.id, nama: user.nama, email: user.email, role: user.role }
      }
    });
  } catch (err) { next(err); }
}

async function getMe(req, res) {
  res.json({
    success: true,
    data: { id: req.user.id, nama: req.user.nama, email: req.user.email, role: req.user.role }
  });
}

async function register(req, res, next) {
  try {
    const { nama, email, password, nim, programStudi } = req.body;
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) throw createError(409, 'Email sudah terdaftar');

    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [userResult] = await conn.execute(
        'INSERT INTO users(nama, email, password, role) VALUES(?,?,?,?)',
        [nama, email, hashedPassword, 'anggota']
      );
      await conn.execute(
        'INSERT INTO anggota(user_id, nim, program_studi) VALUES(?,?,?)',
        [userResult.insertId, nim ?? null, programStudi ?? null]
      );
      await conn.commit();
      conn.release();

      res.status(201).json({ success: true, message: 'Registrasi berhasil. Silakan login.' });
    } catch (err) {
      await conn.rollback();
      conn.release();
      throw err;
    }
  } catch (err) { next(err); }
}

module.exports = { login, getMe, register };