'use strict';

const db = require('../../db');

// User repository with user-related database operations
const UserRepository = {
  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id) {
    const query = 'SELECT id, email, username, role, created_at, updated_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
};

module.exports = UserRepository; 