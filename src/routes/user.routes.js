'use strict';

const UserController = require('../controllers/user.controller');

/**
 * User routes (protected by authentication)
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // Apply authentication to all routes in this plugin
  fastify.addHook('onRequest', fastify.authenticate);
  
  // Get user profile by ID
  fastify.get('/:id', UserController.getProfile);
}

module.exports = routes; 