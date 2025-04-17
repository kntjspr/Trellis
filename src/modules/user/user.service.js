'use strict';

const userRepository = require('./user.repository');

/**
 * User service
 */
const UserService = {
  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} User profile
   */
  async getUserProfile(userId) {
    return userRepository.findById(userId);
  }
};

module.exports = UserService; 