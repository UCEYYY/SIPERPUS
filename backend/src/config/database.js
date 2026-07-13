const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'siperpus',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+07:00'
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Terhubung ke database MariaDB');
    conn.release();
  })
  .catch(err => {
    console.error('⚠️ Database belum siap:', err.message);
    console.error('⚠️ Mencoba koneksi lagi saat ada request...');
  });

module.exports = pool;