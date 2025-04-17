'use strict';

/**
 * User Module
 * 
 * This module handles user profile operations and access:
 * 
 * 1. User Profile Management:
 *    - Retrieves user profiles by ID
 *    - Provides secure access to user information
 *    - Filters sensitive data for non-admin users
 * 
 * 2. Protected Operations:
 *    - All routes require valid authentication
 *    - Implements user-level access controls
 *    - Ensures users can only access appropriate data
 * 
 * Routes Provided:
 * - GET /api/users/:id - Get user profile by ID
 *   - Parameters: id (user ID)
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: User object (stripped of sensitive fields)
 *   - Status codes: 200 (OK), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
 * 
 * Access Control:
 * - All endpoints require authentication via JWT
 * - Routes are protected by the authenticate middleware
 * - Only returns public user information (no passwords or internal data)
 * 
 * Error Handling:
 * - Returns appropriate status codes for different error conditions
 * - Logs errors to server logs for debugging
 * - Provides user-friendly error messages
 * 
 * This module serves as the central component for managing user
 * information after authentication. It handles the retrieval and
 * presentation of user data while maintaining appropriate
 * access controls.
 * 
 * Future Extensions:
 * - User profile updates
 * - Account settings management
 * - Avatar/profile picture handling
 * - User preferences storage
 */

const userRoutes = require('./user.routes');

/**
 * User module registration
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
async function userModule(fastify, options) {
  // Register user routes
  fastify.register(userRoutes);
}

module.exports = userModule; 