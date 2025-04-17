-- Product management schema

-- Drop tables if they exist (safely check if products should be dropped)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_categories;

-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  header VARCHAR(200) NOT NULL,
  subheadline VARCHAR(255),
  body TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  serials TEXT, -- Stored as newline-delimited list of serial numbers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Sample seed data for categories
INSERT INTO product_categories (name, description)
VALUES 
  ('Software', 'Digital software products and licenses'),
  ('E-books', 'Digital books and publications'),
  ('Courses', 'Online learning and educational content'),
  ('Digital Media', 'Digital artwork, music, and multimedia content');

-- Sample seed data for products
INSERT INTO products (header, subheadline, body, price, image_url, category_id, serials)
VALUES 
  (
    'Professional Photo Editor Pro', 
    'Annual License', 
    'Full-featured professional photo editing software with AI capabilities. Includes cloud storage and mobile sync.', 
    89.99, 
    'https://i.pinimg.com/736x/bc/7a/be/bc7abe0426534837fd25b45d2c49709f.jpg', 
    1, 
    'PPEPR0-X4S7-89H2-QWT5-ZK9L
PPEPR0-K9T2-67X3-M5N7-V3B1
PPEPR0-W2E4-12R6-Y1U8-I9O4'
  ),
  (
    'Web Development Masterclass', 
    'Complete Course Bundle', 
    'Learn modern web development with this comprehensive course. Includes HTML, CSS, JavaScript, React, Node.js and more.', 
    49.99, 
    'https://example.com/images/webdev-course.jpg', 
    3, 
    'WDMC23-4X9P-1Z3Y-87VC-Q2MT
WDMC23-5F7G-2K8J-36NM-90BS
WDMC23-6H7J-5L9P-14XC-V7BN
WDMC23-9T6Y-5R3E-86WQ-Z1XC'
  ),
  (
    'Cryptocurrency Investment Guide', 
    'Ultimate 2023 Edition', 
    'Comprehensive guide to cryptocurrency investing with market analysis, trading strategies, and risk management techniques.', 
    24.99, 
    'https://example.com/images/crypto-guide.jpg', 
    2, 
    'CRYIG-A1S2-D3F4-G5H6-J7K8
CRYIG-Q9W8-E7R6-T5Y4-U3I2
CRYIG-Z1X2-C3V4-B5N6-M7K8
CRYIG-P9O8-I7U6-Y5T4-R3E2
CRYIG-L1K2-J3H4-G5F6-D7S8'
  ),
  (
    'Premium Icon Pack', 
    '1000+ Vector Icons', 
    'High-quality vector icons for web and app designers. Includes multiple formats and size variants.', 
    19.99, 
    'https://example.com/images/icon-pack.jpg', 
    4, 
    'ICNPK-1A2B-3C4D-5E6F-7G8H
ICNPK-9I8U-7Y6T-5R4E-3W2Q'
  ); 