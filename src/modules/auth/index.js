'use strict';

/**
 * Auth Module
 * 
 * This module handles all authentication-related functionality:
 * 
 * 1. User Registration (Signup):
 *    - Validates and processes new user registration
 *    - Handles email/username uniqueness checks
 *    - Securely hashes passwords using bcrypt
 *    - Creates user records in the database
 *    - Issues JWT tokens upon successful registration
 * 
 * 2. User Authentication (Signin):
 *    - Validates login credentials (username/email + password)
 *    - Verifies passwords against stored hashes
 *    - Issues JWT tokens for authenticated users
 *    - Handles login failures and banned user checks
 * 
 * 3. Current User Profile Access:
 *    - Provides endpoint to fetch current authenticated user details
 *    - Uses JWT token data to identify the current user
 * 
 * Routes Provided:
 * - POST /api/auth/signup - Register a new user
 *   - Body: { email, username, password }
 *   - Returns: User object and JWT token
 *   - Status codes: 201 (Created), 409 (Conflict), 500 (Server Error)
 * 
 * - POST /api/auth/signin - Authenticate a user
 *   - Body: { login, password } (login can be email or username)
 *   - Returns: User object and JWT token
 *   - Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden), 500 (Server Error)
 * 
 * - GET /api/auth/me - Get current user profile
 *   - Headers: Authorization: Bearer <token>
 *   - Returns: User object
 *   - Status codes: 200 (OK), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
 * 
 * Validation:
 * - Signup: Validates email format, username pattern, password strength
 * - Signin: Validates login and password presence
 * 
 * Dependencies:
 * - bcrypt for password hashing
 * - JWT for token generation and verification
 * - zod for request validation
 * 
 * This module implements the complete authentication flow and serves
 * as the entry point for user identity management in the application.
 * It uses JWT for stateless authentication and bcrypt for secure
 * password handling.
 */

const authRoutes = require('./auth.routes');

/**
 * Auth module registration
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
async function authModule(fastify, options) {
  // Register auth routes with prefix
  fastify.register(authRoutes);
}

module.exports = authModule; 