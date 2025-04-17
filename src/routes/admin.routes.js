'use strict';

const AdminController = require('../controllers/admin.controller');
const { z } = require('zod');

// Admin role check middleware
const isAdmin = (request, reply) => {
  if (request.user.role !== 'admin') {
    return reply.code(403).send({
      error: 'Forbidden',
      message: 'Admin privileges required'
    });
  }
};

// Ban request validation schema
const banSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason is too long')
});

// Role change validation schema
const roleSchema = z.object({
  role: z.enum(['admin', 'member', 'banned'])
});

// Validation middleware generator
const validate = (schema) => {
  return (request, reply, done) => {
    try {
      schema.parse(request.body);
      done();
    } catch (error) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      reply.code(400).send({
        error: 'Validation Error',
        details: formattedErrors
      });
    }
  };
};

/**
 * Admin routes for user management (protected by authentication and admin role)
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // Apply authentication to all routes in this plugin
  fastify.addHook('onRequest', fastify.authenticate);
  
  // Apply admin role check to all routes
  fastify.addHook('onRequest', isAdmin);
  
  // List all users with pagination
  fastify.get('/users', AdminController.listUsers);
  
  // Get detailed user information
  fastify.get('/users/:id', AdminController.getUserDetails);
  
  // Ban a user
  fastify.post('/users/:id/ban', { 
    preHandler: validate(banSchema) 
  }, AdminController.banUser);
  
  // Unban a user
  fastify.post('/users/:id/unban', AdminController.unbanUser);
  
  // Change user role
  fastify.put('/users/:id/role', { 
    preHandler: validate(roleSchema) 
  }, AdminController.changeUserRole);
}

module.exports = routes; 