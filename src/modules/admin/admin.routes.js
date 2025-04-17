'use strict';

const AdminController = require('./admin.controller');
const { validateBanUser, validateChangeRole } = require('./admin.validator');

/**
 * Admin routes for user management
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // All admin routes require authentication and admin role
  fastify.addHook('onRequest', async (request, reply) => {
    // First authenticate
    await fastify.authenticate(request, reply);
    
    // Then check if the user is an admin
    if (request.user && request.user.role !== 'admin') {
      return reply.code(403).send({
        error: 'Forbidden',
        message: 'Admin access required'
      });
    }
  });
  
  // List all users with pagination
  fastify.get('/users', AdminController.listUsers);
  
  // Get user details
  fastify.get('/users/:id', AdminController.getUserDetails);
  
  // Ban user
  fastify.post('/users/:id/ban', { 
    preHandler: validateBanUser 
  }, AdminController.banUser);
  
  // Unban user
  fastify.post('/users/:id/unban', AdminController.unbanUser);
  
  // Change user role
  fastify.put('/users/:id/role', { 
    preHandler: validateChangeRole 
  }, AdminController.changeUserRole);
}

module.exports = routes; 