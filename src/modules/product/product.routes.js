'use strict';

const productController = require('./product.controller');
const { validate } = require('./product.validator');
const { categorySchema, productSchema, productUpdateSchema, serialsSchema } = require('./product.validator');

/**
 * Product routes for managing products and categories
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Route options
 * @param {Function} done - Callback to signal completion
 */
async function routes(fastify, options, done) {
  // Authentication middleware
  const authenticate = async (request, reply) => {
    try {
      await request.jwtVerify();
      
      // Only allow admin users to access these routes
      if (request.user.role !== 'admin') {
        reply.code(403).send({
          error: 'Forbidden',
          message: 'Access denied. Admin privileges required.'
        });
        return false;
      }
      
      return true;
    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: 'Authentication required to access this resource'
      });
      return false;
    }
  };

  // Admin-only routes for category management
  fastify.post(
    '/categories',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        body: categorySchema
      },
      preHandler: validate
    },
    productController.createCategory
  );

  fastify.get(
    '/categories',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getAllCategories
  );

  fastify.get(
    '/categories/:id',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getCategoryById
  );

  fastify.put(
    '/categories/:id',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        body: categorySchema
      },
      preHandler: validate
    },
    productController.updateCategory
  );

  fastify.delete(
    '/categories/:id',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.deleteCategory
  );

  // Admin-only routes for product management
  fastify.post(
    '/products',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        body: productSchema
      },
      preHandler: validate
    },
    productController.createProduct
  );

  fastify.put(
    '/products/:id',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        body: productUpdateSchema
      },
      preHandler: validate
    },
    productController.updateProduct
  );

  fastify.delete(
    '/products/:id',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.deleteProduct
  );

  // Public routes for viewing products
  fastify.get(
    '/products',
    {
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getAllProducts
  );

  fastify.get(
    '/products/:id',
    {
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getProductById
  );

  fastify.get(
    '/categories/:category_id/products',
    {
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getProductsByCategory
  );

  // New routes for managing serials and stock
  
  // Get product stock level
  fastify.get(
    '/products/:id/stock',
    {
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getProductStock
  );
  
  // Get product serials (admin only)
  fastify.get(
    '/products/:id/serials',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      }
    },
    productController.getProductSerials
  );
  
  // Add serials to a product (admin only)
  fastify.post(
    '/products/:id/serials',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        body: serialsSchema
      },
      preHandler: validate
    },
    productController.addProductSerials
  );
  
  // Remove serials from a product (admin only)
  fastify.delete(
    '/products/:id/serials',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        body: serialsSchema
      },
      preHandler: validate
    },
    productController.removeProductSerials
  );
  
  // Get low stock products (admin only)
  fastify.get(
    '/products/low-stock',
    {
      preValidation: authenticate,
      preSerialization: (request, reply, payload, done) => {
        done(null, payload);
      },
      schema: {
        querystring: {
          type: 'object',
          properties: {
            threshold: { type: 'integer', minimum: 1 }
          }
        }
      }
    },
    productController.getLowStockProducts
  );

  done();
}

module.exports = routes; 