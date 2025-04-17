'use strict';

/**
 * Health Module
 * 
 * This module provides system health monitoring endpoints:
 * 
 * 1. API Health Check:
 *    - Provides a simple endpoint to verify API availability
 *    - Returns status code 200 when the API is operational
 *    - Includes timestamp for monitoring response times
 * 
 * 2. System Status:
 *    - Indicates whether the application is functioning properly
 *    - Serves as the primary ping point for monitoring tools
 *    - Can be extended to include more detailed health metrics
 * 
 * Routes Provided:
 * - GET /api/health - Check API health status
 *   - No authentication required
 *   - Returns: { status: "ok", timestamp: "ISO-8601 date string" }
 *   - Status codes: 200 (OK)
 * 
 * Usage:
 * - Health monitoring for load balancers and service discovery
 * - Kubernetes/Docker health probes
 * - Uptime monitoring systems (Pingdom, UptimeRobot, etc.)
 * - CI/CD deployment verification
 * 
 * Implementation:
 * - Lightweight endpoint with minimal processing
 * - No database queries to ensure fast response
 * - No authentication to allow public health checks
 * 
 * This module is critical for operations monitoring and automated health
 * checks. It serves as a lightweight diagnostic endpoint that external
 * monitoring systems can query to verify application availability.
 * 
 * Future Extensions:
 * - Database connection status
 * - System resource utilization
 * - Service dependency health checks
 * - Response time metrics
 */

const healthRoutes = require('./health.routes');

/**
 * Health module registration
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
async function healthModule(fastify, options) {
  // Register health routes
  fastify.register(healthRoutes);
}

module.exports = healthModule; 