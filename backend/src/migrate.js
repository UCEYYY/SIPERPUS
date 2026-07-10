// backend/src/migrate.js — Script untuk setup database di production
require('dotenv').config()
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true, // Izinkan multiple SQL statements
  })

  console.log('Menjalankan migrasi database...')

  // Baca file SQL schema jika ada
  const schemaPath = path.join(__dirname, '../database/schema.sql')
  if (fs.existsSync(schemaPath)) {
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    await conn.query(schemaSQL)
    console.log('Schema berhasil dijalankan!')
  } else {
    console.log('File schema.sql tidak ditemukan, skip migrasi.')
  }

  console.log('Migrasi selesai!')
  await conn.end()
}

migrate().catch(console.error)
