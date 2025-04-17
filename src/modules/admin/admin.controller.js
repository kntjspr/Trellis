'use strict';

const adminService = require('./admin.service');

/**
 * Admin controller for user management
 */
const AdminController = {
  /**
   * List all users with pagination and optional filtering
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async listUsers(request, reply) {
    try {
      const { page = 1, limit = 10, role } = request.query;
      
      const result = await adminService.listUsers({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        role
      });
      
      return reply.code(200).send(result);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while retrieving users'
      });
    }
  },

  /**
   * Get detailed user information
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getUserDetails(request, reply) {
    try {
      const userId = request.params.id;
      
      // Fetch user with full details
      const user = await adminService.getUserDetails(userId);
      
      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      return reply.code(200).send({ user });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while retrieving user details'
      });
    }
  },

  /**
   * Ban a user
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async banUser(request, reply) {
    try {
      const userId = request.params.id;
      const { reason } = request.body;
      
      // Check if user exists
      const userToCheck = await adminService.getUserDetails(userId);
      if (!userToCheck) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      // Check if user is already banned
      if (userToCheck.role === 'banned') {
        return reply.code(400).send({
          error: 'Bad Request',
          message: 'User is already banned'
        });
      }
      
      // Check if trying to ban an admin
      if (userToCheck.role === 'admin') {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Cannot ban an administrator'
        });
      }
      
      // Ban the user
      const bannedUser = await adminService.banUser(userId, reason || 'No reason provided');
      
      return reply.code(200).send({
        message: 'User successfully banned',
        user: bannedUser
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while banning the user'
      });
    }
  },

  /**
   * Unban a user
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async unbanUser(request, reply) {
    try {
      const userId = request.params.id;
      
      // Check if user exists
      const userToCheck = await adminService.getUserDetails(userId);
      if (!userToCheck) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      // Check if user is not banned
      if (userToCheck.role !== 'banned') {
        return reply.code(400).send({
          error: 'Bad Request',
          message: 'User is not banned'
        });
      }
      
      // Unban the user
      const unbannedUser = await adminService.unbanUser(userId);
      
      return reply.code(200).send({
        message: 'User successfully unbanned',
        user: unbannedUser
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while unbanning the user'
      });
    }
  },

  /**
   * Change user role
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async changeUserRole(request, reply) {
    try {
      const userId = request.params.id;
      const { role } = request.body;
      
      // Validate role
      if (!['admin', 'member', 'banned'].includes(role)) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: 'Invalid role. Must be one of: admin, member, banned'
        });
      }
      
      // Check if user exists
      const userToCheck = await adminService.getUserDetails(userId);
      if (!userToCheck) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      // Prevent admin from changing their own role
      if (userToCheck.id === request.user.id) {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'You cannot change your own role'
        });
      }
      
      // Update user role
      const updatedUser = await adminService.changeUserRole(userId, role);
      
      return reply.code(200).send({
        message: `User role successfully changed to ${role}`,
        user: updatedUser
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while changing user role'
      });
    }
  }
};

module.exports = AdminController; 