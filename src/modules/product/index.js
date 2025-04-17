'use strict';

/**
 * Product Module
 * ==============
 * 
 * The Product module provides a complete API for managing products and product categories in the e-commerce system.
 * It follows a layered architecture with clear separation of concerns:
 * 
 * - Routes: Defines API endpoints and authentication requirements
 * - Controller: Handles request/response logic and input validation
 * - Service: Implements business logic and domain rules
 * - Repository: Manages data access and persistence
 * - Validator: Ensures data integrity through schema validation
 * 
 * Available Routes:
 * ----------------
 * 
 * Category Management (Admin only):
 * - POST /categories - Create a new product category
 * - GET /categories - Get all product categories
 * - GET /categories/:id - Get a specific category by ID
 * - PUT /categories/:id - Update a category
 * - DELETE /categories/:id - Delete a category
 * 
 * Product Management (Admin only):
 * - POST /products - Create a new product
 * - PUT /products/:id - Update a product
 * - DELETE /products/:id - Delete a product
 * 
 * Public Product Access:
 * - GET /products - Get all products (with pagination)
 * - GET /products/:id - Get a specific product by ID
 * - GET /categories/:id/products - Get all products in a category
 * - GET /products/:id/stock - Get product stock count
 * 
 * Serial Number Management (Admin only):
 * - GET /products/:id/serials - Get all serial numbers for a product
 * - POST /products/:id/serials - Add new serial numbers to a product
 * - DELETE /products/:id/serials - Remove serial numbers from a product
 * - GET /products/low-stock - Get products with stock below threshold
 * 
 * Data Models:
 * -----------
 * 
 * Category:
 * - id: Serial primary key
 * - name: String (unique, required)
 * - description: Text (optional)
 * - created_at, updated_at: Timestamps
 * 
 * Product:
 * - id: Serial primary key
 * - header: String (required)
 * - subheadline: String (optional)
 * - body: Text (optional)
 * - price: Decimal (required)
 * - image_url: String (optional)
 * - category_id: Foreign key to categories table
 * - serials: Text (newline-delimited list of serial numbers)
 * - created_at, updated_at: Timestamps
 * 
 * Stock Management:
 * ---------------
 * - Product stock is determined by counting serial numbers
 * - Each serial must be on a separate line in the serials field
 * - Serials can be added or removed individually or in batches
 * - Stock count is automatically calculated from available serials
 * - Low stock reporting available for inventory management
 * 
 * Security:
 * --------
 * - Admin routes require JWT authentication
 * - Admin role verification through request.user.role
 * - Public routes available without authentication
 * - Input validation on all routes before processing
 * 
 * Technical Implementation:
 * -----------------------
 * - Database operations via pg client
 * - Newline-delimited storage of serial numbers in PostgreSQL text column
 * - JSON Schema validation (product.validator.js)
 * - Fastify route registration with hooks (product.routes.js)
 * - Error handling and logging in controllers (product.controller.js)
 */

const routes = require('./product.routes');
const productController = require('./product.controller');
const productService = require('./product.service');
const productRepository = require('./product.repository');
const productValidator = require('./product.validator');

/**
 * Register the product module with the Fastify instance
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Module options
 */
async function productModule(fastify, options) {
  // Register the routes with the Fastify instance
  fastify.register(routes);
  
  // Log successful registration
  fastify.log.info('Product module registered');
}

// Export the module for registration with Fastify
module.exports = productModule;

// Export individual components for testing/direct use
module.exports.controller = productController;
module.exports.service = productService;
module.exports.repository = productRepository;
module.exports.validator = productValidator; 