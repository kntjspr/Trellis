'use strict';

const UserController = require('./user.controller');

/**
 * User routes
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // All routes require authentication
  fastify.addHook('onRequest', fastify.authenticate);
  
  // Get user profile by ID
  fastify.get('/:id', UserController.getProfile);
}

module.exports = routes; 