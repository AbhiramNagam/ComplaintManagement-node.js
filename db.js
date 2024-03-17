// db.js

const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  // password: 'RootmySQL#753!',
  password: 'toor5',
  database: 'complaints',
  connectionLimit: 10
});

// Export a function to execute SQL queries
module.exports.query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};
