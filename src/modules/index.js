'use strict';

/**
 * Application Modules Registry
 * 
 * This is the central registration point for all application modules.
 * It orchestrates how modules are loaded and mounted in the application:
 * 
 * Key Responsibilities:
 * 
 * 1. Module Organization:
 *    - Imports all feature modules from their respective directories
 *    - Provides a single entry point for module registration
 *    - Maintains a clean separation between modules
 * 
 * 2. URL Prefix Management:
 *    - Assigns appropriate API URL prefixes to each module
 *    - Structures the API with consistent routing patterns
 *    - Creates a logical hierarchy of endpoints
 * 
 * 3. Plugin Registration:
 *    - Registers each module as a Fastify plugin
 *    - Passes configuration options to modules
 *    - Manages module loading order when needed
 * 
 * API Route Hierarchy:
 * 
 * /api
 * ├── /auth
 * │   ├── POST /signup - Register a new user
 * │   ├── POST /signin - Authenticate a user
 * │   └── GET /me - Get current user profile
 * │
 * ├── /users
 * │   └── GET /:id - Get user profile by ID
 * │
 * ├── /admin
 * │   ├── GET /users - List all users with pagination
 * │   ├── GET /users/:id - Get detailed user information
 * │   ├── POST /users/:id/ban - Ban a user
 * │   ├── POST /users/:id/unban - Unban a user
 * │   └── PUT /users/:id/role - Change user role
 * │
 * ├── /product
 * │   ├── /categories
 * │   │   ├── GET / - Get all categories (admin only)
 * │   │   ├── POST / - Create a new category (admin only)
 * │   │   ├── GET /:id - Get a category by ID (admin only)
 * │   │   ├── PUT /:id - Update a category (admin only)
 * │   │   └── DELETE /:id - Delete a category (admin only)
 * │   │
 * │   ├── /products
 * │   │   ├── GET / - Get all products (public)
 * │   │   ├── POST / - Create a new product (admin only)
 * │   │   ├── GET /:id - Get a product by ID (public)
 * │   │   ├── PUT /:id - Update a product (admin only)
 * │   │   └── DELETE /:id - Delete a product (admin only)
 * │   │
 * │   └── /categories/:id/products - Get products by category (public)
 * │
 * └── /health
 *     └── GET / - Check API health status
 * 
 * Module Structure Pattern:
 * Each module follows the repository-service-controller pattern:
 * - repository.js: Database operations
 * - service.js: Business logic
 * - controller.js: HTTP request handling
 * - routes.js: Route definitions
 * - validator.js: Request validation
 * - index.js: Module registration
 * 
 * Adding New Modules:
 * 1. Create a new directory in /src/modules with the module name
 * 2. Implement the required module files following the pattern
 * 3. Import the module here and register it with a URL prefix
 * 4. No changes to server.js required
 * 
 * This file simplifies the server.js configuration by centralizing all
 * module registration. To add a new feature module to the application,
 * simply import it here and register it with the appropriate URL prefix.
 * 
 * Current Module Structure:
 * - /api/auth/    → Authentication endpoints
 * - /api/users/   → User management endpoints
 * - /api/admin/   → Administrative endpoints
 * - /api/product/ → Product and category management (MODULAR - can be disabled)
 * - /api/health/  → System health monitoring
 */

// Core modules (required)
const authModule = require('./auth');
const userModule = require('./user');
const adminModule = require('./admin');
const healthModule = require('./health');

// Feature modules (optional)
// To disable the product module:
// 1. Comment out the require line below
// 2. Comment out the product module registration in registerModules
// 3. Comment out the \i line in src/db/init.sql
const productModule = require('./product');

/**
 * Register all application modules
 * @param {FastifyInstance} fastify - Fastify instance
 */
async function registerModules(fastify) {
  // Register core modules
  fastify.register(authModule, { prefix: '/api/auth' });
  fastify.register(userModule, { prefix: '/api/users' });
  fastify.register(adminModule, { prefix: '/api/admin' });
  fastify.register(healthModule, { prefix: '/api/health' });
  
  // Register feature modules (optional)
  // Comment out the line below to disable the product module
  fastify.register(productModule, { prefix: '/api/product' });
}

module.exports = { registerModules }; 