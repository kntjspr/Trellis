'use strict';

const db = require('../../db');

// Admin repository with user management operations
const AdminRepository = {
  /**
   * Find user by ID with detailed info
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findUserById(id) {
    const query = `
      SELECT id, email, username, role, banned_reason, banned_at, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Ban a user
   * @param {number} userId - User ID to ban
   * @param {string} reason - Reason for banning
   * @returns {Promise<Object>} Updated user
   */
  async banUser(userId, reason) {
    const query = `
      UPDATE users 
      SET role = 'banned', banned_reason = $2, banned_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, username, role, banned_reason, banned_at, created_at, updated_at
    `;
    
    const values = [userId, reason];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  },

  /**
   * Unban a user
   * @param {number} userId - User ID to unban
   * @returns {Promise<Object>} Updated user
   */
  async unbanUser(userId) {
    const query = `
      UPDATE users 
      SET role = 'member', banned_reason = NULL, banned_at = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, username, role, created_at, updated_at
    `;
    
    const values = [userId];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  },

  /**
   * Change user role
   * @param {number} userId - User ID
   * @param {string} newRole - New role ('admin', 'member', 'banned')
   * @returns {Promise<Object>} Updated user
   */
  async changeRole(userId, newRole) {
    if (!['admin', 'member', 'banned'].includes(newRole)) {
      throw new Error('Invalid role');
    }

    let query = `
      UPDATE users 
      SET role = $2, updated_at = NOW()
    `;

    // If setting to banned, set banned fields
    if (newRole === 'banned') {
      query += `, banned_reason = 'Role changed to banned', banned_at = NOW()`;
    }
    
    // If unbanning, clear banned fields
    if (newRole !== 'banned') {
      query += `, banned_reason = NULL, banned_at = NULL`;
    }

    query += ` WHERE id = $1
      RETURNING id, email, username, role, banned_reason, banned_at, created_at, updated_at`;
    
    const values = [userId, newRole];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  },

  /**
   * List users with pagination and optional filtering
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Items per page
   * @param {string} [options.role] - Filter by role
   * @returns {Promise<Object>} Object with users array and pagination info
   */
  async listUsers({ page = 1, limit = 10, role = null }) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT id, email, username, role, banned_reason, banned_at, created_at, updated_at 
      FROM users
    `;
    
    const values = [];
    if (role) {
      query += ` WHERE role = $1`;
      values.push(role);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    const { rows } = await db.query(query, values);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM users';
    if (role) {
      countQuery += ' WHERE role = $1';
    }
    
    const countResult = await db.query(countQuery, role ? [role] : []);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    
    return {
      users: rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }
};

module.exports = AdminRepository; 