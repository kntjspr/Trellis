'use strict';

const User = require('../models/user.model');

/**
 * Authentication controller
 */
const AuthController = {
  /**
   * User signup
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async signup(request, reply) {
    try {
      const { email, username, password } = request.body;
      
      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return reply.code(409).send({ 
          error: 'Conflict', 
          message: 'Email already in use' 
        });
      }
      
      // Check if username already exists
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) {
        return reply.code(409).send({ 
          error: 'Conflict', 
          message: 'Username already taken' 
        });
      }
      
      // Create new user
      const user = await User.create({ email, username, password });
      
      // Generate JWT token
      const token = request.server.jwt.sign({ 
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }, { 
        expiresIn: process.env.JWT_EXPIRES_IN 
      });
      
      return reply.code(201).send({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          created_at: user.created_at
        },
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: 'An error occurred during registration' 
      });
    }
  },
  
  /**
   * User signin
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async signin(request, reply) {
    try {
      const { login, password } = request.body;
      
      // Find user by email or username
      const user = await User.findByEmail(login) || await User.findByUsername(login);
      
      if (!user) {
        return reply.code(401).send({ 
          error: 'Unauthorized', 
          message: 'Invalid credentials' 
        });
      }
      
      // Check if user is banned
      if (user.role === 'banned') {
        return reply.code(403).send({
          error: 'Forbidden',
          message: 'Your account has been banned',
          banReason: user.banned_reason,
          bannedAt: user.banned_at
        });
      }
      
      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return reply.code(401).send({ 
          error: 'Unauthorized', 
          message: 'Invalid credentials' 
        });
      }
      
      // Generate JWT token
      const token = request.server.jwt.sign({ 
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }, { 
        expiresIn: process.env.JWT_EXPIRES_IN 
      });
      
      return reply.code(200).send({
        message: 'Authentication successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          created_at: user.created_at
        },
        token
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: 'An error occurred during authentication' 
      });
    }
  },
  
  /**
   * Get current user profile
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async me(request, reply) {
    try {
      const userId = request.user.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found'
        });
      }
      
      return reply.code(200).send({
        user
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred retrieving user profile'
      });
    }
  }
};

module.exports = AuthController; 