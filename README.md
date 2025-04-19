# Trellis Backend


Trellis is a Fastify-based backend API designed for high performance, scalability, and modularity. The API is built using a modular architecture that separates concerns into distinct layers (controllers, services, repositories, and validators), enabling easier management and maintenance. It also incorporates JWT (JSON Web Token) authentication for secure access control, ensuring that only authorized users can interact with certain parts of the API.


## Features

- REST API with Fastify
- JWT authentication (signup and signin)
- PostgreSQL database
- Role-based access control (admin, member, banned)
- User management (ban/unban, role changes)
- Input validation with Zod
- Rate limiting
- CORS support
- Modular architecture
- Product management system (Feature module and removable)
- Digital product serial number tracking (Feature module and removable)
- Comprehensive API testing framework

## Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL database

## Setup

1. Clone the repository

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a PostgreSQL database
   ```bash
   psql -U postgres
   ```
   (Use postgres as the default username or the one you created during installation.)
   ```sql
   CREATE DATABASE your_database_name;
   ```

   Connect to the database:
   ```bash
   \c your_database_name
   ```

   To test if the database is created successfully, you can run:
   ```bash
   psql -U postgres
   \l
   ```

4. Configure environment variables
   - Copy `.env.example` or create a new `.env` file with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=db_name
   JWT_SECRET=your-super-secret-jwt-key-replace-this-in-production
   JWT_EXPIRES_IN=1d
   
   # Optional: Admin user settings (defaults below)
   ADMIN_EMAIL=admin@example.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=Admin123456
   ```

5. Initialize the database and create admin user
   ```bash
   # Initialize database schema
   npm run setup
   
   # Create admin user (or use the combined command)
   npm run create-admin
   
   # Or use this combined command to set up everything
   npm run init
   ```

6. Start the server
   ```bash
   # Development with auto-reload
   npm run dev
   
   # Production
   npm start
   ```

## Modular Architecture

Trellis uses a modular architecture to organize functionality:

- **Core Modules**: Auth, User, Admin, Health
- **Feature Modules**: Product (and future modules)

Each module follows the repository-service-controller pattern and maintains its own:
- Routes
- Controllers
- Services
- Repositories
- Validators

Modules can be enabled/disabled in `src/modules/index.js` and each has its own database schema in `src/db/[module]-schema.sql`.

## API Endpoints

Refer to `postman_collection.json` for more details. Feel free to import it to your Postman instance.

## Authentication

The authentication system uses JWT tokens. To access protected routes:

1. Obtain a token via signup or signin
2. Include the token in the `Authorization` header as `Bearer <token>`

## Role-Based Access Control

The system implements the following roles:

- **admin**: Full access to all endpoints, including user management
- **member**: Standard user access, no admin capabilities
- **banned**: Cannot access protected routes, blocked from signin

## Default Admin User

On initial setup, the system creates a default admin user with these credentials:
- **Email**: admin@example.com (can be changed via ADMIN_EMAIL env var)
- **Username**: admin (can be changed via ADMIN_USERNAME env var)
- **Password**: Admin123456 (can be changed via ADMIN_PASSWORD env var)


## Future Plans

   - Implement module installation and activation mechanisms
   - Create a module packaging format for distribution
   - Develop the control panel module management interface
   - Add system monitoring capabilities
   - Build a module marketplace for discovering and sharing modules
   - Implement a developer toolkit for module creation
   - Enhance system with analytics and dashboard capabilities
   - Develop advanced module dependency management

## License

MIT License

