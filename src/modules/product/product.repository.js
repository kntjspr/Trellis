'use strict';

const db = require('../../db');

// Product repository with database operations
const ProductRepository = {
  /**
   * Create a new product category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    const { name, description = '' } = categoryData;
    
    const query = `
      INSERT INTO product_categories (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at, updated_at
    `;
    
    const values = [name, description];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  /**
   * Find category by name
   * @param {string} name - Category name
   * @returns {Promise<Object|null>} Category object or null
   */
  async findCategoryByName(name) {
    const query = 'SELECT * FROM product_categories WHERE name = $1';
    const { rows } = await db.query(query, [name]);
    return rows[0] || null;
  },

  /**
   * Find category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category object or null
   */
  async findCategoryById(id) {
    const query = 'SELECT * FROM product_categories WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  },

  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getAllCategories() {
    const query = 'SELECT * FROM product_categories ORDER BY name';
    const { rows } = await db.query(query);
    return rows;
  },
  
  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object|null>} Updated category or null
   */
  async updateCategory(id, categoryData) {
    const { name, description } = categoryData;
    
    const query = `
      UPDATE product_categories 
      SET name = $2, description = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, description, created_at, updated_at
    `;
    
    const values = [id, name, description];
    const { rows } = await db.query(query, values);
    return rows[0] || null;
  },
  
  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    const query = 'DELETE FROM product_categories WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
  },

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    const { 
      header, 
      subheadline = '', 
      body = '', 
      price, 
      image_url = null, 
      category_id,
      serials = '' 
    } = productData;
    
    const query = `
      INSERT INTO products (header, subheadline, body, price, image_url, category_id, serials)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, header, subheadline, body, price, image_url, category_id, serials, created_at, updated_at
    `;
    
    const values = [header, subheadline, body, price, image_url, category_id, serials];
    const { rows } = await db.query(query, values);
    
    // Calculate stock count before returning
    const product = rows[0];
    product.stock_count = this.countSerials(product.serials);
    
    return product;
  },
  
  /**
   * Find product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  async findProductById(id) {
    const query = `
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const { rows } = await db.query(query, [id]);
    if (!rows[0]) return null;
    
    // Calculate stock count before returning
    const product = rows[0];
    product.stock_count = this.countSerials(product.serials);
    
    return product;
  },
  
  /**
   * Get all products with pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Products per page
   * @returns {Promise<Object>} Object with products array and pagination info
   */
  async getAllProducts({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const { rows } = await db.query(query, [limit, offset]);
    
    // Calculate stock count for each product
    const products = rows.map(product => {
      product.stock_count = this.countSerials(product.serials);
      return product;
    });
    
    // Get total count for pagination
    const countResult = await db.query('SELECT COUNT(*) FROM products');
    const totalCount = parseInt(countResult.rows[0].count, 10);
    
    return {
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  },
  
  /**
   * Get products by category ID with pagination
   * @param {number} categoryId - Category ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Products per page
   * @returns {Promise<Object>} Object with products array and pagination info
   */
  async getProductsByCategory(categoryId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const { rows } = await db.query(query, [categoryId, limit, offset]);
    
    // Calculate stock count for each product
    const products = rows.map(product => {
      product.stock_count = this.countSerials(product.serials);
      return product;
    });
    
    // Get total count for pagination
    const countResult = await db.query('SELECT COUNT(*) FROM products WHERE category_id = $1', [categoryId]);
    const totalCount = parseInt(countResult.rows[0].count, 10);
    
    return {
      products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  },
  
  /**
   * Update a product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object|null>} Updated product or null
   */
  async updateProduct(id, productData) {
    const { 
      header, 
      subheadline, 
      body, 
      price, 
      image_url, 
      category_id,
      serials
    } = productData;
    
    let updateFields = [];
    let values = [id];
    let valueIndex = 2;
    
    if (header !== undefined) {
      updateFields.push(`header = $${valueIndex++}`);
      values.push(header);
    }
    
    if (subheadline !== undefined) {
      updateFields.push(`subheadline = $${valueIndex++}`);
      values.push(subheadline);
    }
    
    if (body !== undefined) {
      updateFields.push(`body = $${valueIndex++}`);
      values.push(body);
    }
    
    if (price !== undefined) {
      updateFields.push(`price = $${valueIndex++}`);
      values.push(price);
    }
    
    if (image_url !== undefined) {
      updateFields.push(`image_url = $${valueIndex++}`);
      values.push(image_url);
    }
    
    if (category_id !== undefined) {
      updateFields.push(`category_id = $${valueIndex++}`);
      values.push(category_id);
    }
    
    if (serials !== undefined) {
      updateFields.push(`serials = $${valueIndex++}`);
      values.push(serials);
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    const query = `
      UPDATE products 
      SET ${updateFields.join(', ')} 
      WHERE id = $1
      RETURNING id, header, subheadline, body, price, image_url, category_id, serials, created_at, updated_at
    `;
    
    const { rows } = await db.query(query, values);
    if (!rows[0]) return null;
    
    // Calculate stock count before returning
    const product = rows[0];
    product.stock_count = this.countSerials(product.serials);
    
    return product;
  },
  
  /**
   * Add serial numbers to a product
   * @param {number} id - Product ID
   * @param {string} newSerials - Serial numbers to add (newline-delimited)
   * @returns {Promise<Object|null>} Updated product or null
   */
  async addSerials(id, newSerials) {
    // First, get the current serials
    const product = await this.findProductById(id);
    if (!product) return null;
    
    // Combine existing and new serials
    const existingSerials = product.serials || '';
    const separator = existingSerials && newSerials ? '\n' : '';
    const combinedSerials = existingSerials + separator + newSerials;
    
    // Update the product with combined serials
    return this.updateProduct(id, { serials: combinedSerials });
  },
  
  /**
   * Remove serial numbers from a product
   * @param {number} id - Product ID
   * @param {string[]} serialsToRemove - Array of serial numbers to remove
   * @returns {Promise<Object|null>} Updated product or null
   */
  async removeSerials(id, serialsToRemove) {
    // First, get the current serials
    const product = await this.findProductById(id);
    if (!product) return null;
    
    if (!product.serials) return product;
    
    // Filter out the serials to remove
    const serialArray = product.serials.split('\n');
    const filteredSerials = serialArray.filter(serial => !serialsToRemove.includes(serial));
    
    // Update the product with filtered serials
    return this.updateProduct(id, { serials: filteredSerials.join('\n') });
  },
  
  /**
   * Count serials to determine stock level
   * @param {string} serials - Newline-delimited serial numbers
   * @returns {number} Number of serials/stock count
   */
  countSerials(serials) {
    if (!serials) return 0;
    
    // Split by newline and count non-empty lines
    return serials.split('\n').filter(serial => serial.trim()).length;
  },
  
  /**
   * Get products with low stock
   * @param {number} threshold - Low stock threshold
   * @returns {Promise<Array>} Products with stock below threshold
   */
  async getLowStockProducts(threshold = 5) {
    const { products } = await this.getAllProducts({ limit: 1000 }); // Get all products
    
    // Filter products with stock below threshold
    return products.filter(product => product.stock_count < threshold);
  },
  
  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProduct(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows.length > 0;
  }
};

module.exports = ProductRepository; 