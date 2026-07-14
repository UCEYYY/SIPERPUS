require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const app = require('./src/app');

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function importData() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    multipleStatements: true,
  });

  console.log('Cek apakah data sudah ada...');
  const [rows] = await conn.query('SELECT COUNT(*) as n FROM users');
  if (rows[0].n > 0) {
    console.log('Data sudah ada, skip import.');
    await conn.end();
    return;
  }

  console.log('Data kosong, import dari siperpus.sql...');
  const sqlPath = path.join(__dirname, 'database', 'siperpus.sql');
  if (!fs.existsSync(sqlPath)) {
    console.log('File siperpus.sql tidak ditemukan, skip import.');
    await conn.end();
    return;
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query(sql);
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Import berhasil!');

  await conn.end();
}

async function start() {
  try {
    await importData();
  } catch (err) {
    console.error('Import gagal:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server SiPerpus berjalan di http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
}

start();
