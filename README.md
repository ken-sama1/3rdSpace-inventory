# 3rdSpace Inventory

3rdSpace Inventory is a web application for managing products and inventory.
It helps users record stock levels, manage product recipes, process stock deductions, and review transaction data.

## Features

- **Dashboard** — View summary information about inventory and transactions.
- **Product management** — Create, view, update, and remove products.
- **Product categories** — Group products by category.
- **Inventory management** — Create and manage inventory items and their stock quantities.
- **Stock adjustments** — Record stock additions and removals.
- **Product recipes** — Define the inventory items and quantities required for each product.
- **Stock deduction** — Deduct the required inventory when users record product transactions.
- **Inventory logs** — Review recorded changes to inventory quantities.
- **Reports** — View sales summaries and product performance for selected periods.
- **User management** — Manage user accounts and roles.
- **Authentication** — Authenticate users and manage their sessions.
- **Image uploads** — Upload product and inventory images through Cloudinary.

## Technology Stack

| Area                   | Technology                   |
| ---------------------- | ---------------------------- |
| Frontend               | React, TypeScript, Vite      |
| Backend                | Node.js, Express, TypeScript |
| Database               | MongoDB                      |
| ORM                    | Prisma                       |
| API communication      | REST, Axios                  |
| Server data management | TanStack Query               |
| Request validation     | Zod                          |
| Image service          | Cloudinary                   |
| Workspace management   | pnpm                         |

## Repository Structure

The repository uses a pnpm workspace. It contains two applications and two shared packages.

```text
3rdSpace-inventory/
├── apps/
│   ├── frontend/       # React frontend application
│   └── backend/        # Express REST API
│
├── docs/
│   └── SETUP.md       # Local development setup guide
│
├── packages/
│   ├── database/       # Prisma client and database definitions
│   └── shared/         # Shared schemas, types, and API contracts
│
├── .env.example       # Environment variable template
├── package.json       # Workspace scripts and dependencies
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
```

## Getting Started

See [SETUP.md](docs/SETUP.md) for the local development setup instructions.

The guide covers the required tools, dependency installation, environment variables, MongoDB configuration, initial database setup, and development commands.

## User Roles

The application defines three user roles:

| Role      | Access description                                            |
| --------- | ------------------------------------------------------------- |
| `ADMIN`   | Access to administrator functions, including user management. |
| `MANAGER` | Access to selected management functions, including reports.   |
| `STAFF`   | Access to selected day-to-day operations.                     |

The backend checks permissions for protected API operations. The frontend also uses user roles to control which navigation links it displays.

## API

The backend provides a versioned REST API. Its base path is:

```text
/api/v1
```

The API includes route groups for authentication, users, products, product categories, inventory items, inventory item categories, transactions, inventory logs, and reports.

## Development

The project uses pnpm workspaces to manage the frontend, backend, and shared packages.

For installation and development commands, follow [SETUP.md](SETUP.md).
