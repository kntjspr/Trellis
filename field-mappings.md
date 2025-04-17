# Field Mappings: API to Database

This document outlines the field mappings between API request/response objects and database columns to assist developers in understanding data flow through the application.

## Product Module

### Product Entity

| API Field (JSON) | Database Column | Type | Description |
|------------------|----------------|------|-------------|
| `id` | `id` | INTEGER | Product ID (primary key) |
| `name` | `name` | TEXT | Product name |
| `description` | `description` | TEXT | Product description |
| `price` | `price` | NUMERIC | Product price |
| `image_url` | `image_url` | TEXT | URL to product image |
| `category_id` | `category_id` | INTEGER | Foreign key to categories table |
| `status` | `status` | TEXT | Product status (active, inactive, draft) |
| `serials` | `serials` | TEXT | Newline-delimited list of serial numbers |
| `stock` | *calculated* | INTEGER | Calculated from number of serial numbers |
| `created_at` | `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | `updated_at` | TIMESTAMP | Last update timestamp |

### Category Entity

| API Field (JSON) | Database Column | Type | Description |
|------------------|----------------|------|-------------|
| `id` | `id` | INTEGER | Category ID (primary key) |
| `name` | `name` | TEXT | Category name |
| `description` | `description` | TEXT | Category description |
| `created_at` | `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | `updated_at` | TIMESTAMP | Last update timestamp |

## Request/Response Format Examples

### Create Product (Request)

```json
{
  "name": "Complete JavaScript Course",
  "description": "Learn JavaScript from scratch to advanced concepts",
  "price": 49.99,
  "image_url": "https://example.com/js-course.jpg",
  "category_id": 3,
  "status": "active",
  "serials": [
    "JS-COURSE-001",
    "JS-COURSE-002",
    "JS-COURSE-003"
  ]
}
```

### Create Product (Alternative Format with String Serials)

```json
{
  "name": "Complete JavaScript Course",
  "description": "Learn JavaScript from scratch to advanced concepts",
  "price": 49.99,
  "image_url": "https://example.com/js-course.jpg",
  "category_id": 3,
  "status": "active",
  "serials": "JS-COURSE-001\nJS-COURSE-002\nJS-COURSE-003"
}
```

### Product Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Complete JavaScript Course",
    "description": "Learn JavaScript from scratch to advanced concepts",
    "price": 49.99,
    "image_url": "https://example.com/js-course.jpg",
    "category_id": 3,
    "status": "active",
    "stock": 3,
    "created_at": "2023-09-15T12:00:00Z",
    "updated_at": "2023-09-15T12:00:00Z"
  }
}
```

### Create Category (Request)

```json
{
  "name": "Courses",
  "description": "Educational courses on various topics"
}
```

### Category Response

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Courses",
    "description": "Educational courses on various topics",
    "created_at": "2023-09-15T10:00:00Z",
    "updated_at": "2023-09-15T10:00:00Z"
  }
}
```

## Special Handling: Serial Numbers

Serial numbers can be provided in two formats:

1. **Array Format** (preferred for API requests):
   ```json
   "serials": ["ABC-123", "DEF-456", "GHI-789"]
   ```

2. **String Format** with newline delimiters (used in database):
   ```json
   "serials": "ABC-123\nDEF-456\nGHI-789"
   ```

The API automatically handles conversion between these formats:
- When storing to database: Arrays are joined with newlines
- When retrieving from database: Automatically converts to array format for responses

## Compatibility Notes

- Both snake_case (`image_url`, `category_id`) and camelCase (`imageUrl`, `categoryId`) are supported in requests for backward compatibility
- Responses always use snake_case for consistency with database naming
- The stock count is dynamically calculated from the number of serials and not stored in the database 