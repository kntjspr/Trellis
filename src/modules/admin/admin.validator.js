'use strict';

const z = require('zod');

// Ban user validation schema
const banUserSchema = z.object({
  reason: z.string()
    .min(3, 'Ban reason must be at least 3 characters')
    .max(500, 'Ban reason cannot exceed 500 characters')
    .optional()
});

// Change role validation schema
const changeRoleSchema = z.object({
  role: z.enum(['admin', 'member', 'banned'], {
    errorMap: () => ({ message: 'Role must be one of: admin, member, banned' })
  })
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
  validateBanUser: validate(banUserSchema),
  validateChangeRole: validate(changeRoleSchema),
  banUserSchema,
  changeRoleSchema
};