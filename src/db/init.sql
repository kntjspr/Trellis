-- Initialize database schema for the application

-- Drop tables if they exist
DROP TABLE IF EXISTS users;

-- Create role enum type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'member', 'banned');
    END IF;
END $$;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'member',
  banned_reason TEXT,
  banned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indices for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Sample user data (uncomment to add test users)
-- INSERT INTO users (email, username, password, role)
-- VALUES 
--   ('admin@example.com', 'admin', '$2b$10$1234567890123456789012345678901234567890123456789012345678', 'admin'),
--   ('user@example.com', 'user', '$2b$10$1234567890123456789012345678901234567890123456789012345678', 'member'); 