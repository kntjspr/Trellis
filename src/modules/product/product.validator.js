'use strict';

const validate = async (request, reply) => {
  const validation = request.validationError;
  if (validation) {
    return reply.code(400).send({
      error: 'Bad Request',
      message: validation.message,
      validation: validation.validation
    });
  }
};

// Category validation schema
const categorySchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { 
      type: 'string', 
      minLength: 2, 
      maxLength: 50 
    },
    description: { 
      type: 'string', 
      maxLength: 500 
    }
  },
  additionalProperties: false
};

// Product validation schema (for creation)
const productSchema = {
  type: 'object',
  required: ['header', 'price', 'category_id'],
  properties: {
    header: { 
      type: 'string', 
      minLength: 3, 
      maxLength: 200 
    },
    subheadline: { 
      type: 'string', 
      maxLength: 255 
    },
    body: { 
      type: 'string', 
      maxLength: 5000 
    },
    price: { 
      type: 'number', 
      minimum: 0.01 
    },
    inventory: { 
      type: 'integer', 
      minimum: 0,
      default: 0
    },
    category_id: { 
      type: 'integer',
      minimum: 1
    },
    image_url: { 
      type: 'string', 
      format: 'uri',
      maxLength: 255
    },
    isActive: { 
      type: 'boolean', 
      default: true 
    },
    serials: {
      oneOf: [
        { type: 'string' },
        { 
          type: 'array',
          items: { type: 'string' }
        }
      ]
    }
  },
  additionalProperties: false
};

// Product update validation schema (for updates)
const productUpdateSchema = {
  type: 'object',
  properties: {
    header: { 
      type: 'string', 
      minLength: 3, 
      maxLength: 200 
    },
    subheadline: { 
      type: 'string', 
      maxLength: 255 
    },
    body: { 
      type: 'string', 
      maxLength: 5000 
    },
    price: { 
      type: 'number', 
      minimum: 0.01 
    },
    inventory: { 
      type: 'integer', 
      minimum: 0 
    },
    category_id: { 
      type: 'integer',
      minimum: 1
    },
    image_url: { 
      type: 'string', 
      format: 'uri',
      maxLength: 255
    },
    isActive: { 
      type: 'boolean' 
    },
    serials: {
      oneOf: [
        { type: 'string' },
        { 
          type: 'array',
          items: { type: 'string' }
        }
      ]
    }
  },
  additionalProperties: false,
  minProperties: 1
};

// Serial numbers validation schema
const serialsSchema = {
  type: 'object',
  required: ['serials'],
  properties: {
    serials: {
      oneOf: [
        { type: 'string' },
        { 
          type: 'array',
          items: { type: 'string' }
        }
      ]
    }
  },
  additionalProperties: false
};

module.exports = {
  validate,
  categorySchema,
  productSchema,
  productUpdateSchema,
  serialsSchema
}; 