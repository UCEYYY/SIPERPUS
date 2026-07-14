const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT, 10) || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'siperpus',
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