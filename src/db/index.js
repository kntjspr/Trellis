'use strict';

const { Pool } = require('pg');

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000 // Close idle clients after 30 seconds
});

// Verify database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// Export the pool for use in other modules
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 