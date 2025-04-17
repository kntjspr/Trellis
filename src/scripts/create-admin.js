'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Create a PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function createAdminUser() {
  try {
    // Admin user details
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'Admin123456';
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE email = $1 OR username = $2';
    const checkResult = await pool.query(checkQuery, [email, username]);
    
    if (checkResult.rowCount > 0) {
      // Admin user already exists
      console.log(`Admin user (${username}) already exists.`);
      
      // Update the role to admin if it's not already
      if (checkResult.rows[0].role !== 'admin') {
        const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2';
        await pool.query(updateQuery, ['admin', checkResult.rows[0].id]);
        console.log(`Updated user role to admin for ${username}.`);
      }
    } else {
      // Create admin user
      const insertQuery = `
        INSERT INTO users (email, username, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, username, role
      `;
      
      const result = await pool.query(insertQuery, [email, username, hashedPassword, 'admin']);
      console.log('Admin user created successfully:');
      console.log(result.rows[0]);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await pool.end();
  }
}

// Run the function
createAdminUser(); 