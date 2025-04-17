'use strict';

const authRepository = require('./auth.repository');

/**
 * Authentication service
 */
const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user
   */
  async registerUser(userData) {
    return authRepository.create(userData);
  },

  /**
   * Authenticate a user
   * @param {string} login - Email or username
   * @param {string} password - User password
   * @returns {Promise<Object|null>} User if authenticated, null otherwise
   */
  async authenticateUser(login, password) {
    // Find user by email or username
    const user = await authRepository.findByEmail(login) || 
                 await authRepository.findByUsername(login);
    
    if (!user) {
      return null;
    }
    
    // Verify password
    const isValidPassword = await authRepository.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    
    return user;
  },

  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} User profile
   */
  async getUserProfile(userId) {
    return authRepository.findById(userId);
  },

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} Whether the email exists
   */
  async emailExists(email) {
    const user = await authRepository.findByEmail(email);
    return !!user;
  },

  /**
   * Check if username already exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} Whether the username exists
   */
  async usernameExists(username) {
    const user = await authRepository.findByUsername(username);
    return !!user;
  }
};

module.exports = AuthService; 