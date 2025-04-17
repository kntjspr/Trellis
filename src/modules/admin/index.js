'use strict';

/**
 * Admin Module
 * 
 * This module handles all administrative operations:
 * 
 * 1. User Management:
 *    - Lists all users with pagination support
 *    - Filters users by role (admin, member, banned)
 *    - Retrieves detailed user information
 *    - Provides complete user profile access to admins
 * 
 * 2. User Status Control:
 *    - Bans users with custom reason tracking
 *    - Unbans previously banned users
 *    - Stores ban timestamps and reasons
 * 
 * 3. Role Management:
 *    - Changes user roles (admin, member, banned)
 *    - Enforces role change validations
 *    - Prevents admins from changing their own role
 * 
 * 4. Admin-Only Access:
 *    - All routes require admin role
 *    - Implements hierarchical permission checks
 *    - Secures sensitive operations behind authorization
 * 
 * Routes Provided:
 * - GET /api/admin/users - List all users with pagination
 *   - Query parameters: page, limit, role
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: Array of users with pagination metadata
 *   - Status codes: 200 (OK), 403 (Forbidden), 500 (Server Error)
 * 
 * - GET /api/admin/users/:id - Get detailed user information
 *   - Parameters: id (user ID)
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: Complete user object including sensitive fields
 *   - Status codes: 200 (OK), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
 * 
 * - POST /api/admin/users/:id/ban - Ban a user
 *   - Parameters: id (user ID)
 *   - Body: { reason } (optional)
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: Updated user object
 *   - Status codes: 200 (OK), 400 (Bad Request), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
 * 
 * - POST /api/admin/users/:id/unban - Unban a user
 *   - Parameters: id (user ID)
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: Updated user object
 *   - Status codes: 200 (OK), 400 (Bad Request), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
 * 
 * - PUT /api/admin/users/:id/role - Change user role
 *   - Parameters: id (user ID)
 *   - Body: { role } (must be one of: admin, member, banned)
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: Updated user object
 *   - Status codes: 200 (OK), 400 (Bad Request), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
 * 
 * Validation:
 * - Ban user: Validates ban reason format
 * - Change role: Ensures role is one of the allowed values
 * 
 * Access Control:
 * - All routes require admin role in the JWT token
 * - Admins cannot ban other admins
 * - Admins cannot change their own role
 * 
 * This module implements the administrative functionality necessary for
 * platform management. It provides administrative users with the tools to
 * monitor and control user accounts while enforcing appropriate access 
 * controls to prevent unauthorized operations.
 */

const adminRoutes = require('./admin.routes');

/**
 * Admin module registration
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
async function adminModule(fastify, options) {
  // Register admin routes
  fastify.register(adminRoutes);
}

module.exports = adminModule; 