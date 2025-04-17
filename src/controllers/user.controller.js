'use strict';

const User = require('../models/user.model');

/**
 * User controller for protected user routes
 */
const UserController = {
  /**
   * Get user profile by ID
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getProfile(request, reply) {
    try {
      const userId = request.params.id;
      
      // Check if requested user exists
      const user = await User.findById(userId);
      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      // Return user profile without sensitive information
      return reply.code(200).send({
        user
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while retrieving user profile'
      });
    }
  }
};

module.exports = UserController; 