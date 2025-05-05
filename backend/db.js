// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1', // replace with your host
  user: 'root', // e.g., root
  password: 'Gooniess811!',
  database: 'woomigo_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL DB');
});

module.exports = db;
