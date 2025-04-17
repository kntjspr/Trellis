'use strict';

require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const rateLimit = require('@fastify/rate-limit');

// Import modules
const { registerModules } = require('./modules');

// Register plugins
fastify.register(cors, {
  origin: true, // Adjust this in production
  credentials: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Custom JWT verification decorator with banned user check
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
    
    // Check if user is banned (role info is in the token)
    if (request.user && request.user.role === 'banned') {
      throw new Error('User is banned');
    }
  } catch (err) {
    reply.code(403).send({ 
      error: 'Forbidden', 
      message: err.message === 'User is banned' ? 
        'Your account has been banned' : 
        'Invalid token or insufficient permissions' 
    });
    return reply;
  }
});

// Register all application modules
fastify.register(registerModules);

// Start the server
const start = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server is running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 