# PHP/PDO Backend Migration Plan

## Goal

Rewrite the existing TypeScript/Express backend in plain PHP using PDO while preserving the external API contract:

- Same `/api/v1/...` endpoints
- Same request fields
- Same JSON response shapes
- Same status codes
- Same error codes
- Same refresh-token cookie behavior

The PHP implementation may simplify internal security, typing, and framework concerns, but it must not change the API consumed by the frontend.

> The current backend uses MongoDB through Prisma. PDO requires a SQL database, so the PHP rewrite requires a migration to MySQL/MariaDB or PostgreSQL. MySQL/MariaDB is recommended for a simple PDO implementation.

## 1. Response Contract

### Successful responses

Every successful response uses:

```json
{
  "message": "success",
  "data": {}
}
```

Example:

```json
{
  "message": "Login successfull",
  "data": {
    "accessToken": "jwt-token"
  }
}
```

### Error responses

Every error response uses:

```json
{
  "message": "Invalid value",
  "errors": [],
  "code": "VALIDATION_ERROR"
}
```

Suggested PHP helpers:

```php
Response::success($data, $message = 'success', $status = 200);
Response::error($message, $code, $errors = [], $status = 400);
```

JSON should be emitted with:

```php
json_encode($payload, JSON_UNESCAPED_SLASHES);
```

Dates must be returned as ISO-8601 strings.

## 2. PHP Project Architecture

```text
backend-php/
├── public/
│   └── index.php
├── routes/
│   ├── api.php
│   ├── auth.php
│   ├── users.php
│   ├── inventory-items.php
│   ├── products.php
│   ├── inventory-item-categories.php
│   └── product-categories.php
├── app/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── UserController.php
│   │   ├── InventoryItemController.php
│   │   ├── ProductController.php
│   │   ├── InventoryItemCategoryController.php
│   │   └── ProductCategoryController.php
│   ├── Services/
│   │   ├── AuthService.php
│   │   ├── UserService.php
│   │   ├── InventoryItemService.php
│   │   ├── ProductService.php
│   │   ├── InventoryItemCategoryService.php
│   │   └── ProductCategoryService.php
│   ├── Repositories/
│   │   ├── UserRepository.php
│   │   ├── SessionRepository.php
│   │   ├── InventoryItemRepository.php
│   │   ├── ProductRepository.php
│   │   ├── RecipeItemRepository.php
│   │   ├── InventoryLogRepository.php
│   │   └── Category repositories
│   ├── DTO/
│   │   ├── AuthDto.php
│   │   ├── UserDto.php
│   │   ├── ProductDto.php
│   │   ├── InventoryItemDto.php
│   │   └── Category DTOs
│   ├── Validators/
│   │   ├── AuthValidator.php
│   │   ├── ProductValidator.php
│   │   └── InventoryItemValidator.php
│   ├── Middleware/
│   │   ├── AuthMiddleware.php
│   │   ├── JsonMiddleware.php
│   │   └── ErrorMiddleware.php
│   ├── Support/
│   │   ├── Response.php
│   │   ├── ApiException.php
│   │   ├── Jwt.php
│   │   └── QueryParser.php
│   └── Database/
│       └── Connection.php
├── database/
│   ├── migrations/
│   └── seeders/
├── config/
│   ├── app.php
│   └── database.php
├── composer.json
└── .env
```

Dependency direction:

```text
Route
  → Middleware
  → Controller
  → Service
  → Repository
  → PDO
```

Controllers handle HTTP input and output. Services contain business rules.
Repositories contain SQL and database access. PHP does not need to reproduce
the TypeScript DTO and type system; associative arrays are acceptable as long
as the JSON contract remains consistent.

### How a request flows

For `POST /api/v1/auth/login`:

```text
public/index.php
  → router matches /api/v1/auth/login
  → AuthController::login()
  → read JSON body
  → AuthService::login()
  → UserRepository finds the user through PDO
  → AuthService verifies the password and creates tokens
  → SessionRepository stores the refresh session
  → AuthController sets the cookie
  → Response::success() returns JSON
```

For inventory and product operations:

```text
HTTP request
  → route
  → controller
  → service
  → repository
  → MySQL
  → array/mapper
  → response JSON
```

This is a lightweight separation of responsibilities, not a strict enterprise
architecture. Use simple classes or functions where they help, and do not add
interfaces or DTO classes only for formality.

Practical rules:

- Use associative arrays for request and response data.
- Keep SQL in repositories, not controllers.
- Use PDO prepared statements for values.
- Keep response formatting in one `Response` helper.
- Use a small API exception for expected errors.
- Use database transactions for stock changes.

## 3. Authentication Endpoints

### `POST /api/v1/auth/login`

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "message": "Login successfull",
  "data": {
    "accessToken": "jwt-token"
  }
}
```

Status: `200`

The refresh token is stored in an HTTP-only cookie and is not included in `data`.

Invalid credentials:

```json
{
  "message": "Invalid username or password",
  "errors": [],
  "code": "UNAUTHORIZED_ERROR"
}
```

Status: `401`

### `POST /api/v1/auth/register`

Request:

```json
{
  "username": "admin",
  "password": "password"
}
```

Response:

```json
{
  "message": "Account created successfully",
  "data": {
    "id": 1,
    "username": "admin"
  }
}
```

Status: `201`

### `POST /api/v1/auth/refresh`

Reads the refresh-token cookie and returns:

```json
{
  "message": "success",
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

Status: `200`

### `POST /api/v1/auth/logout`

Clears the refresh-token cookie and revokes the session.

```json
{
  "message": "success",
  "data": null
}
```

## 4. Inventory Item Endpoints

Base path: `/api/v1/inventory-items`

| Method | Endpoint | Success data |
|---|---|---|
| GET | `/` | `InventoryItemDto[]` |
| POST | `/create` | `InventoryItemDto` |
| GET | `/:id` | `InventoryItemDto` |
| PATCH | `/:id` | `InventoryItemDto` |
| DELETE | `/:id` | Deleted item plus timestamps |
| POST | `/:id/stock-in` | Updated `InventoryItemDto` |
| POST | `/:id/stock-out` | Updated `InventoryItemDto` |

Inventory item DTO:

```json
{
  "id": 1,
  "name": "Coffee beans",
  "description": null,
  "quantity": 1000,
  "unit": "G",
  "imageUrl": null,
  "categoryId": null,
  "category": null
}
```

Stock-in request:

```json
{
  "quantity": 500
}
```

Stock-out request:

```json
{
  "quantity": 100,
  "reason": "Production"
}
```

Insufficient stock:

```json
{
  "message": "Stock insufficient",
  "errors": [],
  "code": "STOCK_INSUFFICIENT"
}
```

## 5. Product Endpoints

Base path: `/api/v1/products`

| Method | Endpoint | Success data |
|---|---|---|
| GET | `/` | `ProductWithInventoryItemsDto[]` |
| POST | `/create` | `ProductDto` |
| GET | `/:id` | `ProductWithInventoryItemsDto` |
| PATCH | `/:id` | `ProductWithInventoryItemsDto` |
| DELETE | `/:id` | Deleted product plus timestamps |
| POST | `/:id/deduct-stock` | `InventoryItemDto[]` |

Product DTO:

```json
{
  "id": 1,
  "name": "Latte",
  "description": null,
  "imageUrl": null,
  "categoryId": null,
  "category": null,
  "price": 120,
  "recipeItems": [
    {
      "id": 1,
      "inventoryItemId": 1,
      "quantity": 18,
      "unit": "G"
    }
  ]
}
```

For product list and get-by-id responses, each recipe item additionally includes its `inventoryItem`.

## 6. Category Endpoints

### Inventory item categories

Base path: `/api/v1/inventory-item-categories`

| Method | Endpoint | Success data |
|---|---|---|
| GET | `/` | Categories with inventory items |
| POST | `/create` | Category |
| GET | `/:id` | Category with inventory items |
| PATCH | `/:id` | Category |
| DELETE | `/:id` | Deleted category plus timestamps |
| POST | `/:id/assign-items` | Updated inventory items |
| POST | `/:id/unassign-items` | Updated inventory items |

Assign request:

```json
{
  "inventoryItemIds": [1, 2]
}
```

### Product categories

Base path: `/api/v1/product-categories`

| Method | Endpoint | Success data |
|---|---|---|
| GET | `/` | Categories with products |
| POST | `/create` | Category |
| GET | `/:id` | Category with products |
| PATCH | `/:id` | Category |
| DELETE | `/:id` | Deleted category plus timestamps |
| POST | `/:id/assign-items` | Updated products |
| POST | `/:id/unassign-items` | Updated products |

The product-category endpoints intentionally retain the existing `assign-items` and `unassign-items` names for frontend compatibility.

## 7. User Endpoints

Base path: `/api/v1/users`

| Method | Endpoint | Success data |
|---|---|---|
| GET | `/me` | `UserDto` |
| PATCH | `/me` | Updated `UserDto` |

Response:

```json
{
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin"
  }
}
```

The current TypeScript route file defines `/users/me`, but the router is not currently mounted in `routes/index.ts`. The PHP implementation should mount this route intentionally.

## 8. SQL Database Design

The MongoDB models should map to:

```text
users
user_sessions
inventory_item_categories
inventory_items
product_categories
products
recipe_items
inventory_logs
transactions
```

Recommended ID strategy:

```sql
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
```

The PHP API returns IDs as JSON numbers. Foreign keys use the same integer
type, for example `user_id INT UNSIGNED NOT NULL`.

Relationships:

```text
users 1──N user_sessions
inventory_item_categories 1──N inventory_items
product_categories 1──N products
products 1──N recipe_items
inventory_items 1──N recipe_items
inventory_items 1──N inventory_logs
```

## 9. Stock Transaction Rules

Stock changes must run inside a database transaction:

```text
BEGIN
  SELECT inventory item FOR UPDATE
  validate quantity
  update inventory_items.quantity
  insert inventory_logs record
COMMIT
```

This prevents incorrect inventory values when multiple requests modify the same item.

## 10. Authentication Implementation

Use:

- `password_hash()` during registration
- `password_verify()` during login
- JWT access tokens
- HTTP-only refresh-token cookies
- `user_sessions` for refresh-token revocation
- SHA-256 hashes of refresh tokens in the database

Access-token payload:

```json
{
  "userId": 1
}
```

Suggested configuration:

```text
ACCESS_TOKEN_TTL=900
REFRESH_TOKEN_TTL=2592000
```

## 11. Query Compatibility

The backend supports nested query parameters:

```text
/api/v1/products?filter[name]=latte
/api/v1/products?filter[categoryId][]=1&filter[categoryId][]=2
/api/v1/products?options[sortBy]=price&options[order]=asc
```

Normalize them into:

```php
[
    'filter' => [
        'name' => 'latte',
        'categoryId' => [1, 2]
    ],
    'options' => [
        'sortBy' => 'price',
        'order' => 'asc'
    ]
]
```

Sortable columns must be whitelisted:

```php
[
    'name' => 'p.name',
    'price' => 'p.price',
    'category' => 'pc.name'
]
```

Do not interpolate arbitrary query values into SQL.

## 12. Error Mapping

| Code | HTTP status |
|---|---:|
| `VALIDATION_ERROR` | 400 |
| `UNKNOWN_ERROR` | 400 |
| `STOCK_INSUFFICIENT` | 400 |
| `UNAUTHORIZED_ERROR` | 401 |
| `FORBIDDEN_ERROR` | 403 |
| `NOT_FOUND` | 404 |
| `ITEM_IN_USE` | 409 |
| `CONFLICT` | 409 |
| `INTERNAL_ERROR` | 500 |

## 13. Implementation Phases

1. **Freeze API contracts**
   - Copy route paths, request fields, DTOs, messages, status codes, and error codes.
   - Add request/response fixtures.

2. **Create the SQL schema**
   - Convert Prisma models to migrations.
   - Preserve relationships and ID format.
   - Migrate existing MongoDB data if required.

3. **Build the PHP foundation**
   - Composer autoloading
   - PDO connection
   - Front controller
   - Router
   - Response and exception helpers
   - Environment configuration

4. **Implement authentication**
   - Login
   - Register
   - Refresh
   - Logout
   - Cookie handling
   - JWT middleware
   - Session revocation

5. **Implement inventory items**
   - CRUD
   - Stock-in
   - Stock-out
   - Inventory logs
   - Transaction locking

6. **Implement products**
   - CRUD
   - Recipe items
   - Product stock deduction

7. **Implement categories**
   - Product categories
   - Inventory item categories
   - Assign and unassign operations

8. **Implement users**
   - `/users/me`
   - Explicitly mount the users route

9. **Run compatibility tests**
   - Compare PHP responses with the TypeScript backend.
   - Verify JSON keys, nesting, null values, status codes, messages, cookies, and filters.

## Core Rule

PHP may simplify the internals, but it must not simplify or alter the external API contract.
