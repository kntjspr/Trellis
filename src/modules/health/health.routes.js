'use strict';

const HealthController = require('./health.controller');

/**
 * Health check routes
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // Health check endpoint
  fastify.get('/', HealthController.getHealth);
}

module.exports = routes; 