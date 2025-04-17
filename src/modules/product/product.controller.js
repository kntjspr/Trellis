'use strict';

const productService = require('./product.service');
const { validate } = require('./product.validator');

/**
 * Product controller for product management endpoints
 */
const ProductController = {
  /**
   * Create a new product category
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async createCategory(request, reply) {
    try {
      await validate(request, reply);
      
      const { name, description } = request.body;
      const category = await productService.createCategory({ name, description });
      
      return reply.code(201).send(category);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Get all categories
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getAllCategories(request, reply) {
    try {
      const categories = await productService.getAllCategories();
      return reply.send(categories);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Get category by ID
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getCategoryById(request, reply) {
    try {
      const categoryId = parseInt(request.params.id, 10);
      
      const category = await productService.getCategoryById(categoryId);
      if (!category) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Category not found'
        });
      }
      
      return reply.code(200).send({
        category
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'An error occurred while retrieving the category'
      });
    }
  },
  
  /**
   * Update a category
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async updateCategory(request, reply) {
    try {
      await validate(request, reply);
      
      const { id } = request.params;
      const { name, description } = request.body;
      
      const category = await productService.updateCategory(id, { name, description });
      if (!category) {
        return reply.code(404).send({ error: 'Not Found', message: 'Category not found' });
      }
      
      return reply.send(category);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Delete a category
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async deleteCategory(request, reply) {
    try {
      const { id } = request.params;
      
      const deleted = await productService.deleteCategory(id);
      if (!deleted) {
        return reply.code(404).send({ error: 'Not Found', message: 'Category not found' });
      }
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Create a new product
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async createProduct(request, reply) {
    try {
      await validate(request, reply);
      
      const productData = request.body;
      const product = await productService.createProduct(productData);
      
      return reply.code(201).send(product);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Get all products with pagination
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getAllProducts(request, reply) {
    try {
      const products = await productService.getAllProducts();
      return reply.send(products);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Get products by category
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getProductsByCategory(request, reply) {
    try {
      const { category_id } = request.params;
      
      const products = await productService.getProductsByCategory(category_id);
      return reply.send(products);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Get product by ID
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getProductById(request, reply) {
    try {
      const { id } = request.params;
      
      const product = await productService.getProductById(id);
      if (!product) {
        return reply.code(404).send({ error: 'Not Found', message: 'Product not found' });
      }
      
      return reply.send(product);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Update a product
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async updateProduct(request, reply) {
    try {
      await validate(request, reply);
      
      const { id } = request.params;
      const productData = request.body;
      
      const product = await productService.updateProduct(id, productData);
      if (!product) {
        return reply.code(404).send({ error: 'Not Found', message: 'Product not found' });
      }
      
      return reply.send(product);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Delete a product
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async deleteProduct(request, reply) {
    try {
      const { id } = request.params;
      
      const deleted = await productService.deleteProduct(id);
      if (!deleted) {
        return reply.code(404).send({ error: 'Not Found', message: 'Product not found' });
      }
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error', message: error.message });
    }
  },
  
  /**
   * Get product stock count
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getProductStock(request, reply) {
    try {
      const { id } = request.params;
      
      const product = await productService.getProductById(id);
      if (!product) {
        return reply.code(404).send({ 
          error: 'Not Found', 
          message: 'Product not found' 
        });
      }
      
      return reply.send({
        product_id: product.id,
        product_name: product.header,
        stock_count: product.stock_count
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    }
  },
  
  /**
   * Get all product serials
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getProductSerials(request, reply) {
    try {
      const { id } = request.params;
      
      const product = await productService.getProductById(id);
      if (!product) {
        return reply.code(404).send({ 
          error: 'Not Found', 
          message: 'Product not found' 
        });
      }
      
      // Convert newline-delimited serials to array
      const serials = product.serials ? 
        product.serials.split('\n').filter(serial => serial.trim()) : 
        [];
      
      return reply.send({
        product_id: product.id,
        product_name: product.header,
        serials,
        count: serials.length
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    }
  },
  
  /**
   * Add serial numbers to a product
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async addProductSerials(request, reply) {
    try {
      await validate(request, reply);
      
      const { id } = request.params;
      const { serials } = request.body;
      
      const product = await productService.addSerials(id, serials);
      if (!product) {
        return reply.code(404).send({ 
          error: 'Not Found', 
          message: 'Product not found' 
        });
      }
      
      // Convert newline-delimited serials to array for response
      const serialsArray = product.serials ? 
        product.serials.split('\n').filter(serial => serial.trim()) : 
        [];
      
      return reply.send({
        product_id: product.id,
        product_name: product.header,
        serials: serialsArray,
        count: serialsArray.length,
        message: 'Serials added successfully'
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    }
  },
  
  /**
   * Remove serial numbers from a product
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async removeProductSerials(request, reply) {
    try {
      await validate(request, reply);
      
      const { id } = request.params;
      const { serials } = request.body;
      
      const product = await productService.removeSerials(id, serials);
      if (!product) {
        return reply.code(404).send({ 
          error: 'Not Found', 
          message: 'Product not found' 
        });
      }
      
      // Convert newline-delimited serials to array for response
      const serialsArray = product.serials ? 
        product.serials.split('\n').filter(serial => serial.trim()) : 
        [];
      
      return reply.send({
        product_id: product.id,
        product_name: product.header,
        serials: serialsArray,
        count: serialsArray.length,
        message: 'Serials removed successfully'
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    }
  },
  
  /**
   * Get products with low stock
   * @param {Object} request - Fastify request
   * @param {Object} reply - Fastify reply
   */
  async getLowStockProducts(request, reply) {
    try {
      const threshold = request.query.threshold ? 
        parseInt(request.query.threshold, 10) : 5;
      
      const products = await productService.getLowStockProducts(threshold);
      
      return reply.send({
        products,
        count: products.length,
        threshold
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error', 
        message: error.message 
      });
    }
  }
};

module.exports = ProductController; 