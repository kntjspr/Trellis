'use strict';

const z = require('zod');

// Signup validation schema
const signupSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email cannot exceed 255 characters'),
  
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

// Signin validation schema
const signinSchema = z.object({
  // Allow either email or username for signin
  login: z.string()
    .min(3, 'Login must be at least 3 characters')
    .max(255, 'Login cannot exceed 255 characters'),
  
  password: z.string()
    .min(1, 'Password is required')
    .max(100, 'Password cannot exceed 100 characters')
});

// Validation middleware generator
const validate = (schema) => {
  return (request, reply, done) => {
    try {
      // Validate request body against schema
      schema.parse(request.body);
      done();
    } catch (error) {
      // Format Zod errors into a readable format
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

module.exports = {
  validateSignup: validate(signupSchema),
  validateSignin: validate(signinSchema),
  signupSchema,
  signinSchema
}; 