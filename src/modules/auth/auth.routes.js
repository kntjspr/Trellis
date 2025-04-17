'use strict';

const AuthController = require('./auth.controller');
const { validateSignup, validateSignin } = require('./auth.validator');

/**
 * Authentication routes
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Route options
 */
async function routes(fastify, options) {
  // Register signup route
  fastify.post('/signup', { 
    preHandler: validateSignup 
  }, AuthController.signup);
  
  // Register signin route
  fastify.post('/signin', { 
    preHandler: validateSignin 
  }, AuthController.signin);
  
  // Get current authenticated user
  fastify.get('/me', { 
    onRequest: fastify.authenticate 
  }, AuthController.me);
}

module.exports = routes; 