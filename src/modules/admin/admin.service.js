'use strict';

const adminRepository = require('./admin.repository');

/**
 * Admin service for user management
 */
const AdminService = {
  /**
   * List all users with pagination and optional filtering
   * @param {Object} options - Query options
   * @returns {Promise<Object>} List of users with pagination
   */
  async listUsers(options) {
    return adminRepository.listUsers(options);
  },

  /**
   * Get detailed user information
   * @param {number} userId - User ID to get details for
   * @returns {Promise<Object|null>} User details
   */
  async getUserDetails(userId) {
    return adminRepository.findUserById(userId);
  },

  /**
   * Ban a user
   * @param {number} userId - User ID to ban
   * @param {string} reason - Reason for banning
   * @returns {Promise<Object>} Banned user
   */
  async banUser(userId, reason) {
    return adminRepository.banUser(userId, reason);
  },

  /**
   * Unban a user
   * @param {number} userId - User ID to unban
   * @returns {Promise<Object>} Unbanned user
   */
  async unbanUser(userId) {
    return adminRepository.unbanUser(userId);
  },

  /**
   * Change user role
   * @param {number} userId - User ID
   * @param {string} newRole - New role
   * @returns {Promise<Object>} Updated user
   */
  async changeUserRole(userId, newRole) {
    return adminRepository.changeRole(userId, newRole);
  }
};

module.exports = AdminService; 