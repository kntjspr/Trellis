'use strict';

/**
 * Health controller for health check endpoints
 */
const HealthController = {
  /**
   * Get API health status
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getHealth(request, reply) {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = HealthController; 