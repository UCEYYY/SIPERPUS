require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const app = require('./src/app');

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  console.log('Menjalankan migrasi database...');
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await conn.query(schemaSQL);
    console.log('Schema berhasil dijalankan!');
  } else {
    console.log('File schema.sql tidak ditemukan, skip migrasi.');
  }
  await conn.end();
}

async function start() {
  try {
    await migrate();
  } catch (err) {
    console.error('Migrasi gagal:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server SiPerpus berjalan di http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  });
}

start();
