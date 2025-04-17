'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Read SQL files
const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
const productSql = fs.readFileSync(path.join(__dirname, 'product-schema.sql'), 'utf8');

// Define modules configuration - enables easy enabling/disabling of modules
const modules = {
  core: true,      // Core schema (users, etc.)
  product: true    // Product module schema
};

// Execute SQL scripts
async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Execute core schema
    if (modules.core) {
      console.log('Applying core schema...');
      await client.query(initSql);
    }
    
    // Execute product schema
    if (modules.product) {
      console.log('Applying product schema...');
      await client.query(productSql);
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (err) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
setupDatabase(); 