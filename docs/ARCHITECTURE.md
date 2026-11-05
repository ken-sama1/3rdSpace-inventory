# System Architecture

## 1. Technology Stack

| System component                | Technology              |
| ------------------------------- | ----------------------- |
| Frontend                        | React, TypeScript, Vite |
| Backend                         | Node.js, Express        |
| Database                        | MongoDB                 |
| Object-relational mapping (ORM) | Prisma                  |
| API                             | REST                    |
| HTTP client                     | Axios                   |
| Server data                     | TanStack Query          |
| Data validation                 | Zod                     |
| Image service                   | Cloudinary              |
| Package manager                 | pnpm                    |

## 2. System Components

#### 2.1 Frontend Application

**Source directory:** `apps/frontend`

The frontend displays the application interface. It sends HTTP requests to the backend API.

The frontend performs these tasks:

- Display application pages and components.
- Accept user input.
- Manage the user authentication state.
- Send requests to the backend.
- Display product and inventory data.
- Display transactions and reports.
- Display API responses and error messages.

The frontend uses React Router to manage page navigation.

The frontend uses Axios to send HTTP requests. It uses TanStack Query to retrieve, store, and update server data.

The frontend uses React Context to share authentication and notification data between components.

The frontend also uses Cloudinary to upload images.

#### 2.1.1 Hooks

The `hooks/` directory contains custom React hooks. It includes application-level hooks and hooks that use TanStack Query.

The TanStack Query hooks are organized by application domain. Each domain has separate directories for queries and mutations.

- **Queries:** Retrieve server data through TanStack Query's `useQuery`.
- **Mutations:** Create, update, or delete server data through TanStack Query's `useMutation`.

The directory structure follows the application's domain areas, such as `products/`, `inventory-items/`, `categories/`, and `users/`.

Other hooks provide application-level logic. Examples include `useAuth.ts`, `useSession.ts`, and `useStockConfig.ts`.

### 2.2 Backend Application

**Source directory:** `apps/backend`

The backend runs an Express server. It provides the REST API for the application.

The API uses the `/api/v1` base path.

The backend uses a layered architecture. Each layer has a separate task.

#### 2.2.1 Routes

Routes define the API endpoints.

Each route connects an HTTP method and path to the required middleware and controller.

The main route groups are:

- Authentication
- Users
- Products
- Product categories
- Inventory items
- Inventory item categories
- Transactions
- Inventory logs
- Reports

#### 2.2.2 Middleware

Middleware processes requests before they reach the controller.

The backend uses middleware for these tasks:

- Check access tokens.
- Check user permissions.
- Validate request data.
- Handle application errors.
- Apply the CORS policy.

The authentication middleware checks the access token. The role middleware checks the user's role.

The validation middleware checks request data against Zod schemas.

#### 2.2.3 Controllers

Controllers handle HTTP requests and responses.

A controller performs these tasks:

1. Read the request data.
2. Call the required service.
3. Receive the service result.
4. Send an HTTP response to the client.

Controllers do not contain the main business logic.

#### 2.2.4 Services

Services contain the business logic.

A service performs the operations that the application requires.

Examples include:

- Create and update products.
- Add and remove inventory items.
- Add and deduct inventory stock.
- Process product stock deductions.
- Record transactions.
- Create inventory logs.
- Generate reports.
- Manage user sessions.

Services use the Prisma client to access the database.

#### 2.2.5 Mappers

Mappers convert database records into response objects.

They select and format the data that the API returns to the frontend.

This separates database models from the data that the frontend receives.

### 2.3 Shared Package

**Source directory:** `packages/shared`

The shared package contains data definitions that both applications use.

It includes:

- Zod validation schemas.
- TypeScript types and interfaces.
- API request definitions.
- API response definitions.
- Common error definitions.
- Product data definitions.
- Inventory data definitions.
- Transaction data definitions.
- User data definitions.

The frontend and backend use these definitions to keep their data formats consistent.

### 2.4 Database Package

**Source directory:** `packages/database`

The database package manages database access.

It provides:

- The Prisma client.
- Prisma model definitions.
- Database configuration.
- Database seed scripts.
- Database index setup scripts.

The backend imports the shared Prisma client from this package.

MongoDB stores the application data.

## 3. Database Structure

The database contains the following main models.

| Model                   | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `User`                  | Stores user account data and user roles.                           |
| `UserSession`           | Stores refresh-token session data.                                 |
| `Product`               | Stores product data and prices.                                    |
| `ProductCategory`       | Groups products.                                                   |
| `InventoryItem`         | Stores raw material data and stock quantities.                     |
| `InventoryItemCategory` | Groups inventory items.                                            |
| `RecipeItem`            | Stores the inventory items and quantities that a product requires. |
| `Transaction`           | Stores transaction data and total prices.                          |
| `TransactionItem`       | Stores the products in a transaction.                              |
| `InventoryLog`          | Records changes to inventory quantities.                           |

### 3.1 Model Relationships

The database uses these relationships:

- A user can have multiple sessions.
- A product can belong to one product category.
- A product can have multiple recipe items.
- A recipe item refers to one inventory item.
- An inventory item can belong to one inventory category.
- An inventory item can have multiple inventory logs.
- A transaction can have multiple transaction items.
- A transaction item refers to one product.

A recipe item defines the quantity of an inventory item that one unit of a product requires.

An inventory log records a stock change. It also stores the reason and source of the change.

## 4. System Request Flow

The system uses the following process to handle a normal API request.

1. The user performs an action in the frontend.
2. The frontend API module prepares the request.
3. Axios sends the HTTP request to the backend.
4. Express receives the request.
5. The route selects the required middleware and controller.
6. The middleware checks authentication, permissions, and request data when required.
7. The controller calls the service.
8. The service executes the business logic.
9. Prisma accesses the database when required.
10. The mapper prepares the response data.
11. The controller sends the HTTP response.
12. The frontend receives and displays the result.

### 4.1 Request Flow Diagram

```text
User
 |
 v
Frontend
 |
 v
Axios API Client
 |
 v
Express Server
 |
 v
API Routes
 |
 v
Middleware
 |
 v
Controller
 |
 v
Service
 |
 v
Prisma Client
 |
 v
MongoDB
 |
 v
Response Mapper
 |
 v
HTTP Response
 |
 v
Frontend
```

## 5. Inventory Processing

The inventory module manages stock quantities.

The application supports stock adjustments and product stock deductions.

### 5.1 Stock-In Process

The stock-in process adds a quantity to an inventory item.

The backend performs these steps:

1. Find the inventory item.
2. Check that the item exists.
3. Increase the stock quantity.
4. Create an inventory log.
5. Return the updated inventory item.

The service uses a database transaction for the stock update and log creation.

### 5.2 Stock-Out Process

The stock-out process removes a quantity from an inventory item.

The backend performs these steps:

1. Find the inventory item.
2. Check that the item exists.
3. Check that the available quantity is sufficient.
4. Decrease the stock quantity.
5. Create an inventory log.
6. Return the updated inventory item.

The service uses a database transaction for these operations.

### 5.3 Product Stock Deduction

A product can require several inventory items.

The recipe items define the required inventory quantities.

When a user processes a product deduction, the backend performs these steps:

1. Find the product.
2. Retrieve its recipe items.
3. Calculate the required inventory quantities.
4. Check the available stock.
5. Stop the process if the stock is not sufficient.
6. Create a transaction record.
7. Create inventory log records.
8. Decrease the inventory quantities.
9. Return the updated inventory data.

The backend uses a database transaction for the transaction record, inventory logs, and stock updates.

The multi-product deduction service also calculates the combined stock requirements before it updates the inventory.

## 6. Authentication and Authorization

The application uses JSON Web Tokens (JWT) for user authentication.

The authentication system uses two tokens:

- Access token
- Refresh token

The frontend sends the access token in the HTTP Authorization header.

The backend sends the refresh token in an HTTP-only cookie.

The database stores a hash of each refresh token in a user session record.

The backend checks the refresh token before it creates a new token pair.

The backend also checks the session status and expiration date.

### 6.1 User Roles

The application defines three user roles:

| Role      | Description                                   |
| --------- | --------------------------------------------- |
| `ADMIN`   | Has access to administrator operations.       |
| `MANAGER` | Has access to selected management operations. |
| `STAFF`   | Has access to selected operational tasks.     |

The backend uses role-based middleware to control access to protected operations.

The frontend also uses user roles to control the display of some navigation links.

The backend performs the actual permission checks. Frontend navigation controls do not replace backend authorization.

## 7. Project Organization

The repository uses a pnpm workspace.

The workspace contains two applications and two shared packages.

```text
3rdSpace-inventory/
|
+-- apps/
|   |
|   +-- frontend/
|   |   +-- src/
|   |       +-- api/
|   |       +-- components/
|   |       +-- context/
|   |       +-- features/
|   |       +-- hooks/
|   |       +-- pages/
|   |       +-- routes/
|   |
|   +-- backend/
|       +-- src/
|           +-- config/
|           +-- controllers/
|           +-- errors/
|           +-- middleware/
|           +-- routes/
|           +-- services/
|
+-- packages/
|   |
|   +-- database/
|   |   +-- prisma/
|   |   +-- scripts/
|   |   +-- seeders/
|   |
|   +-- shared/
|       +-- src/
|
+-- package.json
+-- pnpm-workspace.yaml
+-- pnpm-lock.yaml
```

Each application and package has a separate purpose.

The pnpm workspace allows the applications to use the shared packages.

The root `package.json` defines commands to build and run the workspace applications and packages.

## 8. External Services

### 8.1 Cloudinary

The frontend uses Cloudinary for image uploads.

The frontend sends image upload requests to the Cloudinary API.

The application stores image URLs in the database records.

The database does not store the uploaded image files.

### 8.2 Environment Configuration

The application uses environment variables for its configuration.

The `.env.example` file lists the main configuration values.

These values include:

- API port
- Allowed frontend origins
- Database connection URL
- API base URL
- Cloudinary configuration
- Access token secret
- Refresh token secret

The applications read these values when they start.

## 9. Deployment Scope

The repository defines the applications, packages, and local development commands.

The repository does not define a complete production deployment architecture.

The hosting location, production network, and production database setup require separate deployment documentation.

## 10. Conclusion

The system uses a client-server architecture with a layered backend.

The frontend handles the user interface and sends requests to the backend.

The backend handles authentication, request validation, business logic, and database operations.

The shared package keeps data definitions consistent between the frontend and backend.

The database package provides a common way to access MongoDB through Prisma.

This architecture separates the main system functions into distinct components.
