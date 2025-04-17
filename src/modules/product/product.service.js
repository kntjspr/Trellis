'use strict';

const productRepository = require('./product.repository');

/**
 * Product service with business logic for product management
 */
const ProductService = {
  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Category object
   */
  async createCategory(categoryData) {
    return productRepository.createCategory(categoryData);
  },

  /**
   * Create a new category or find existing one by name
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Category object
   */
  async createOrFindCategory(categoryData) {
    // Try to find the category by name first
    const existingCategory = await productRepository.findCategoryByName(categoryData.name);
    
    // If found, return it
    if (existingCategory) {
      return existingCategory;
    }
    
    // Otherwise, create a new one
    return this.createCategory(categoryData);
  },
  
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getAllCategories() {
    return productRepository.getAllCategories();
  },
  
  /**
   * Get category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category object or null
   */
  async getCategoryById(id) {
    return productRepository.findCategoryById(id);
  },
  
  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object|null>} Updated category or null
   */
  async updateCategory(id, categoryData) {
    return productRepository.updateCategory(id, categoryData);
  },
  
  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    return productRepository.deleteCategory(id);
  },
  
  /**
   * Create a new product
   * @param {Object} productData - Product data with possible category name
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    // Handle case where category is provided by name instead of ID
    if (productData.category && typeof productData.category === 'string' && !productData.category_id) {
      // Try to find or create the category
      const category = await this.createOrFindCategory({ name: productData.category });
      
      // Update the product data with the category ID
      productData.category_id = category.id;
      delete productData.category; // Remove the category name to avoid conflicts
    }
    
    // Format serials if provided as an array
    if (Array.isArray(productData.serials)) {
      productData.serials = productData.serials.join('\n');
    }
    
    return productRepository.createProduct(productData);
  },
  
  /**
   * Get all products with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Object with products array and pagination info
   */
  async getAllProducts(options = {}) {
    return productRepository.getAllProducts(options);
  },
  
  /**
   * Get products by category ID with pagination
   * @param {number} categoryId - Category ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Object with products array and pagination info
   */
  async getProductsByCategory(categoryId, options = {}) {
    return productRepository.getProductsByCategory(categoryId, options);
  },
  
  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  async getProductById(id) {
    return productRepository.findProductById(id);
  },
  
  /**
   * Update a product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object|null>} Updated product or null
   */
  async updateProduct(id, productData) {
    // Handle case where category is provided by name instead of ID
    if (productData.category && typeof productData.category === 'string' && !productData.category_id) {
      // Try to find or create the category
      const category = await this.createOrFindCategory({ name: productData.category });
      
      // Update the product data with the category ID
      productData.category_id = category.id;
      delete productData.category; // Remove the category name to avoid conflicts
    }
    
    // Format serials if provided as an array
    if (Array.isArray(productData.serials)) {
      productData.serials = productData.serials.join('\n');
    }
    
    return productRepository.updateProduct(id, productData);
  },
  
  /**
   * Add serial numbers to a product
   * @param {number} id - Product ID
   * @param {string|string[]} serials - Serial numbers to add (string with newline delimiters or array)
   * @returns {Promise<Object|null>} Updated product or null
   */
  async addSerials(id, serials) {
    // Format serials to string if it's an array
    const serialsStr = Array.isArray(serials) ? serials.join('\n') : serials;
    
    return productRepository.addSerials(id, serialsStr);
  },
  
  /**
   * Remove serial numbers from a product
   * @param {number} id - Product ID
   * @param {string|string[]} serials - Serial numbers to remove (string with newline delimiters or array)
   * @returns {Promise<Object|null>} Updated product or null
   */
  async removeSerials(id, serials) {
    // Convert string with newlines to array if needed
    const serialsArray = Array.isArray(serials) ? serials : serials.split('\n');
    
    return productRepository.removeSerials(id, serialsArray);
  },
  
  /**
   * Get stock count for a product
   * @param {number} id - Product ID
   * @returns {Promise<number>} Stock count
   */
  async getStockCount(id) {
    const product = await this.getProductById(id);
    if (!product) return 0;
    
    return product.stock_count;
  },
  
  /**
   * Get products with low stock
   * @param {number} threshold - Low stock threshold
   * @returns {Promise<Array>} Products with stock below threshold
   */
  async getLowStockProducts(threshold = 5) {
    return productRepository.getLowStockProducts(threshold);
  },
  
  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    return productRepository.deleteProduct(id);
  }
};

module.exports = ProductService; 