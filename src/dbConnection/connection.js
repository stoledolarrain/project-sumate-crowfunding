require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.query('SELECT 1 + 1 AS solution')
    .then(() => console.log('Base de Datos Conectada'))
    .catch(err => console.error('Error Conexión:', err.message));

module.exports = db;