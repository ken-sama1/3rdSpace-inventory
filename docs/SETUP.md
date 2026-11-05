# Development Setup

This guide explains how to prepare the project for local development.

## Requirements

Install the following tools:

- Node.js `26.12.1`
- pnpm `12.5.1`
- Git
- MongoDB `8.3.4`
- MongoDB Shell (`mongosh`)

The versions above are the versions used during development. Other compatible versions may work, but the project has not been tested with all versions.

## 1. Clone the Repository

Clone the repository and enter the project directory:

```bash
git clone https://github.com/ken-sama1/3rdSpace-inventory.git
cd 3rdSpace-inventory
```

## 2. Install Dependencies

Install the workspace dependencies:

```bash
pnpm install
```

## 3. Configure Environment Variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Set the values in `.env` for your local environment.

| Variable               | Description                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ENV_LOADED`           | Environment flag. The example file sets this value to `yes`.                                                    |
| `ALLOWED_ORIGINS`      | Lists the frontend origins that can access the backend through CORS. Separate multiple origins with commas.     |
| `PORT`                 | Sets the port for the backend server. The development example uses `3000`.                                      |
| `ENV`                  | Sets the application environment. Use `dev` for local development.                                              |
| `DATABASE_URL`         | Sets the MongoDB connection string. It includes the database host, port, database name, and connection options. |
| `ACCESS_TOKEN_SECRET`  | Secret used to sign and verify access tokens.                                                                   |
| `REFRESH_TOKEN_SECRET` | Separate secret used to sign and verify refresh tokens.                                                         |
| `VITE_API_URL`         | Sets the backend base URL used by the frontend.                                                                 |
| `VITE_API_VERSION`     | Sets the API version used in frontend request URLs. The current version is `v1`.                                |
| `VITE_CLD_NAME`        | Sets the Cloudinary cloud name used for image uploads.                                                          |
| `VITE_CLD_PRESET`      | Sets the Cloudinary upload preset used for image uploads.                                                       |

Use strong, unique values for both token secrets. Do not commit `.env` to the repository.

Cloudinary values are needed for the image upload feature. The other values must match your local backend and database configuration.

## 4. Configure MongoDB

The project uses MongoDB through Prisma ORM. The current Prisma setup requires MongoDB to run as a replica set.

The following commands show a local development setup. They assume that MongoDB is installed and that port `27017` is available.

Start MongoDB with the replica set name `rs0`:

```bash
mongod --replSet rs0 --bind_ip localhost
```

Keep this process running. Open another terminal and connect to MongoDB:

```bash
mongosh
```

Initialize the replica set:

```javascript
rs.initiate();
```

Check the replica set status:

```javascript
rs.status();
```

After MongoDB reports that the replica set is initialized, set `DATABASE_URL` in `.env` to:

```env
DATABASE_URL=mongodb://127.0.0.1:27017/3rdSpace-inventory?replicaSet=rs0&directConnection=true
```

The `directConnection=true` option is suitable for this single-endpoint local development setup. Use a suitable replica set connection string for other deployment configurations.

> **Platform note:** These commands start `mongod` directly. A Windows service or another managed MongoDB installation may require you to set the replica set name in its configuration instead.

## 5. Initialize the Database

The project does not provide a public user registration flow for initial account creation. Run the database setup script to create the initial administrator and add the predefined inventory items.

First, build the workspace packages:

```bash
pnpm packages:build
```

This command builds the packages. The database package build also generates the Prisma client and applies the Prisma schema to the configured database.

Then run the database setup script:

```bash
pnpm --filter @repo/database run setup
```

The script prompts you to select which data to seed:

```text
Seed users? [y/n]:
Seed inventory items? [y/n]:
```

- **Seed users:** Enter a username and password. The script creates an administrator account with the `ADMIN` role. The script is intended for initial setup and does not create another administrator if one already exists.
- **Seed inventory items:** Inserts the predefined inventory items into the database. The script skips this step if inventory items already exist.

The setup script also creates the database indexes defined by the project.

> **Known issue:** The current user seeder stores the password as plain text. The login service checks passwords with `bcrypt.compare`, which expects a bcrypt hash. The seeded administrator may therefore be unable to log in. Fix the seeder to hash the password before you rely on this account.

## 6. Build the Project

Build all packages and applications:

```bash
pnpm run build
```

The root build script runs linting, builds the workspace packages, and then builds the applications.

If the combined build fails, run the package and application builds separately to identify which step fails:

```bash
pnpm run packages:build
pnpm run apps:build
```

Build the packages before the applications. The applications use the shared workspace packages.

## 7. Start the Development Servers

Start the frontend and backend development servers:

```bash
pnpm apps:dev
```

Start the shared package TypeScript watcher in a separate terminal:

```bash
pnpm --filter @repo/shared run dev
```

This command watches the shared package. It does not start a watcher for every package. The current root `packages:dev` script uses the filter `shared`, but the package name is `@repo/shared`. Use the explicit command above unless the root script is updated.

To watch database package source files during development, run this command in another terminal:

```bash
pnpm --filter @repo/database run dev
```

## 8. Start the Built Applications

Build the project first. Then start the compiled frontend and backend applications:

```bash
pnpm run start
```

This command runs the workspace packages that define a `start` script. The frontend serves its build output, and the backend starts its compiled server.
