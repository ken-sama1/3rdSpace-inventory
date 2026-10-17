# 3rdSpace-Inventory

## Required env variables

- ENV_LOADED=yes
- ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173,http://localhost:43745
- PORT=3000

- ENV="dev"

- VITE_API_URL=http://localhost:3000
- VITE_API_VERSION=v1
- VITE_CLD_NAME=
- VITE_CLD_PRESET=
-
- DATABASE_URL=mongodb://127.0.0.1:27017/3rdSpace-inventory
- MYSQL_DATABASE_URL=mysql://user:password@127.0.0.1:3306/3rdspace_inventory
- SYNC_INTERVAL_MS=3000
-
- ACCESS_TOKEN_SECRET=Your_Secret
- REFRESH_TOKEN_SECRET=Your_Secret

## Sync MongoDB and MySQL

Set `DATABASE_URL` to the MongoDB database and `MYSQL_DATABASE_URL` to the
MySQL `3rdspace_inventory` database, then run `pnpm sync:databases` from the
repository root. The process stays running and polls for changes every
`SYNC_INTERVAL_MS` milliseconds (3 seconds by default); stop it with Ctrl+C.
Keep the process running and both databases available for continuous sync.

On the first run, the sync process drops and recreates its application tables
in MySQL, then copies MongoDB data into them. Back up MySQL first. Subsequent
runs use `.sync-state.json` to detect inserts, updates, and deletes from either
database without rebuilding the MySQL tables. Keep that file between runs; if
it is removed, or the MySQL database/application tables are missing, the next
run recreates the database if needed and rebuilds the application tables from
MongoDB. The MySQL user needs permission to create the database. Only the
application tables are touched.

When both databases changed the same record since the last sync, the side with
the newer `updatedAt` value wins when both sides have one; MongoDB wins ties and
records without comparable `updatedAt` values. A single-sided change is copied
to the other database. The state file stores hashes and timestamps, not row
contents. Treat both database URLs as secrets and run only one sync process at
a time.
