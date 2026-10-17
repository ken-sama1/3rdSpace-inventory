import { createHash } from "node:crypto";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import mysql from "mysql2/promise";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../..");
dotenv.config({ path: path.join(repositoryRoot, ".env") });

const mongoUrl = process.env["DATABASE_URL"];
const mysqlUrl = process.env["MYSQL_DATABASE_URL"];
const pollInterval = Number(process.env["SYNC_INTERVAL_MS"] ?? 3000);
const statePath = path.join(repositoryRoot, ".sync-state.json");

if (!mongoUrl) {
  throw new Error("DATABASE_URL must point to the primary MongoDB database.");
}
if (!mysqlUrl) {
  throw new Error("MYSQL_DATABASE_URL must point to the MySQL database.");
}
if (!Number.isSafeInteger(pollInterval) || pollInterval < 250) {
  throw new Error("SYNC_INTERVAL_MS must be an integer of at least 250.");
}

const tables = [
  {
    name: "users",
    collection: "users",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["username", "VARCHAR(191) NOT NULL"],
      ["password", "TEXT NOT NULL"],
      ["role", "VARCHAR(16) NOT NULL"],
      ["createdAt", "DATETIME(3) NOT NULL"],
    ],
    objectIdFields: [],
    indexes: ["UNIQUE KEY users_username_unique (username)"],
  },
  {
    name: "user_sessions",
    collection: "user_sessions",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["userId", "CHAR(24) NOT NULL"],
      ["token", "VARCHAR(512) NOT NULL"],
      ["expiresAt", "DATETIME(3) NOT NULL"],
      ["isRevoked", "BOOLEAN NOT NULL DEFAULT FALSE"],
    ],
    objectIdFields: ["userId"],
    indexes: [
      "UNIQUE KEY user_sessions_token_unique (token)",
      "KEY user_sessions_userId_index (userId)",
      "CONSTRAINT user_sessions_userId_fkey FOREIGN KEY (userId) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE",
    ],
  },
  {
    name: "inventory_item_categories",
    collection: "inventory_item_categories",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["name", "VARCHAR(191) NOT NULL"],
      ["createAt", "DATETIME(3) NOT NULL"],
      ["updatedAt", "DATETIME(3) NOT NULL"],
    ],
    objectIdFields: [],
    indexes: ["UNIQUE KEY inventory_item_categories_name_unique (name)"],
  },
  {
    name: "product_categories",
    collection: "product_categories",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["name", "VARCHAR(191) NOT NULL"],
      ["createAt", "DATETIME(3) NOT NULL"],
      ["updatedAt", "DATETIME(3) NOT NULL"],
    ],
    objectIdFields: [],
    indexes: ["UNIQUE KEY product_categories_name_unique (name)"],
  },
  {
    name: "inventory_items",
    collection: "inventory_items",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["name", "VARCHAR(191) NOT NULL"],
      ["description", "TEXT NULL"],
      ["quantity", "DOUBLE NOT NULL DEFAULT 0"],
      ["unit", "VARCHAR(8) NOT NULL"],
      ["imageUrl", "TEXT NULL"],
      ["categoryId", "CHAR(24) NULL"],
      ["createdAt", "DATETIME(3) NOT NULL"],
      ["updatedAt", "DATETIME(3) NOT NULL"],
    ],
    objectIdFields: ["categoryId"],
    indexes: [
      "KEY inventory_items_categoryId_index (categoryId)",
      "CONSTRAINT inventory_items_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES inventory_item_categories (id) ON DELETE SET NULL ON UPDATE CASCADE",
    ],
  },
  {
    name: "products",
    collection: "products",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["name", "VARCHAR(191) NOT NULL"],
      ["description", "TEXT NULL"],
      ["imageUrl", "TEXT NULL"],
      ["categoryId", "CHAR(24) NULL"],
      ["price", "INT NOT NULL DEFAULT 0"],
      ["createdAt", "DATETIME(3) NOT NULL"],
      ["updatedAt", "DATETIME(3) NOT NULL"],
    ],
    objectIdFields: ["categoryId"],
    indexes: [
      "KEY products_categoryId_index (categoryId)",
      "CONSTRAINT products_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES product_categories (id) ON DELETE SET NULL ON UPDATE CASCADE",
    ],
  },
  {
    name: "recipe_items",
    collection: "recipe_items",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["productId", "CHAR(24) NOT NULL"],
      ["inventoryItemId", "CHAR(24) NOT NULL"],
      ["quantity", "DOUBLE NOT NULL"],
    ],
    objectIdFields: ["productId", "inventoryItemId"],
    indexes: [
      "KEY recipe_items_productId_index (productId)",
      "KEY recipe_items_inventoryItemId_index (inventoryItemId)",
      // Keep legacy Mongo recipes whose products have already been removed.
      "CONSTRAINT recipe_items_inventoryItemId_fkey FOREIGN KEY (inventoryItemId) REFERENCES inventory_items (id) ON DELETE RESTRICT ON UPDATE CASCADE",
    ],
  },
  {
    name: "transactions",
    collection: "transactions",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["totalPrice", "DOUBLE NOT NULL"],
      ["createdAt", "DATETIME(3) NOT NULL"],
    ],
    objectIdFields: [],
    indexes: [],
  },
  {
    name: "transaction_items",
    collection: "TransactionItem",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["productId", "CHAR(24) NOT NULL"],
      ["productName", "VARCHAR(191) NOT NULL"],
      ["quantity", "INT NOT NULL"],
      ["unitPrice", "DOUBLE NOT NULL"],
      ["transactionId", "CHAR(24) NOT NULL"],
    ],
    objectIdFields: ["productId", "transactionId"],
    indexes: [
      "KEY transaction_items_productId_index (productId)",
      "KEY transaction_items_transactionId_index (transactionId)",
      // Keep Mongo transaction items that reference deleted products or transactions.
    ],
  },
  {
    name: "inventory_logs",
    collection: "inventory_logs",
    columns: [
      ["id", "CHAR(24) NOT NULL"],
      ["inventoryItemId", "CHAR(24) NOT NULL"],
      ["quantityChange", "DOUBLE NOT NULL"],
      ["itemName", "VARCHAR(191) NOT NULL"],
      ["reason", "TEXT NOT NULL"],
      ["createdAt", "DATETIME(3) NOT NULL"],
      ["sourceType", "VARCHAR(16) NOT NULL"],
      ["sourceId", "CHAR(24) NULL"],
    ],
    objectIdFields: ["inventoryItemId", "sourceId"],
    indexes: [
      "KEY inventory_logs_inventoryItemId_index (inventoryItemId)",
      "CONSTRAINT inventory_logs_inventoryItemId_fkey FOREIGN KEY (inventoryItemId) REFERENCES inventory_items (id) ON DELETE RESTRICT ON UPDATE CASCADE",
    ],
  },
];

const quoteIdentifier = (identifier) => `\`${identifier.replaceAll("`", "``")}\``;

function normalize(value) {
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value.toHexString === "function") return value.toHexString();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "__v")
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalize(entry)]),
    );
  }
  return value;
}

function hashRow(row) {
  return createHash("sha256").update(JSON.stringify(normalize(row))).digest("hex");
}

function rowTimestamp(row) {
  const value = row?.updatedAt;
  if (value === undefined || value === null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

function mongoRow(document) {
  const fields = Object.fromEntries(
    Object.entries(document).filter(([key]) => key !== "_id" && key !== "__v"),
  );
  return normalize({ ...fields, id: document._id.toHexString() });
}

function mysqlRow(row, table) {
  const { id, ...fields } = row;
  for (const [column, type] of table.columns) {
    if (type.startsWith("BOOLEAN") && fields[column] !== null) {
      fields[column] = Boolean(fields[column]);
    }
  }
  return normalize({ ...fields, id: String(id) });
}

function timestampValue(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

async function loadState() {
  try {
    const parsed = JSON.parse(await readFile(statePath, "utf8"));
    if (parsed.version !== 1 || !parsed.tables || typeof parsed.tables !== "object") {
      throw new Error(`Unsupported sync state format in ${statePath}`);
    }
    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function clearState() {
  try {
    await unlink(statePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function saveState(state) {
  const temporaryPath = `${statePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(state)}\n`, { mode: 0o600 });
  await rename(temporaryPath, statePath);
}

async function readMongoRows(database, table) {
  const documents = await database.collection(table.collection).find({}).toArray();
  return new Map(documents.map((document) => {
    const row = mongoRow(document);
    return [row.id, row];
  }));
}

async function readMysqlRows(connection, table) {
  const [rows] = await connection.query(`SELECT * FROM ${quoteIdentifier(table.name)}`);
  return new Map(rows.map((value) => {
    const row = mysqlRow(value, table);
    return [row.id, row];
  }));
}

async function writeMysqlRow(connection, table, row) {
  const columns = table.columns.map(([name]) => name);
  const placeholders = columns.map(() => "?").join(", ");
  const updates = columns
    .filter((column) => column !== "id")
    .map((column) => `${quoteIdentifier(column)} = VALUES(${quoteIdentifier(column)})`)
    .join(", ");
  const sql = `INSERT INTO ${quoteIdentifier(table.name)} (${columns.map(quoteIdentifier).join(", ")}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
  const values = columns.map((column) => {
    const value = row[column];
    if (value instanceof Date) return value;
    if (column.endsWith("At") || column === "expiresAt") {
      const date = timestampValue(value);
      if (!date) throw new Error(`Invalid date in ${table.name}.${column}`);
      return date;
    }
    return value ?? null;
  });
  await connection.execute(sql, values);
}

async function writeMongoRow(database, table, row) {
  const { id, ...fields } = row;
  const document = { ...fields };
  for (const field of table.objectIdFields) {
    if (document[field]) document[field] = ObjectId.createFromHexString(document[field]);
  }
  for (const [field, value] of Object.entries(document)) {
    if (value !== null && value !== undefined && (field.endsWith("At") || field === "expiresAt")) {
      document[field] = timestampValue(value);
    }
  }
  await database.collection(table.collection).replaceOne(
    { _id: ObjectId.createFromHexString(id) },
    document,
    { upsert: true },
  );
}

async function deleteMysqlRow(connection, table, id) {
  await connection.execute(
    `DELETE FROM ${quoteIdentifier(table.name)} WHERE id = ?`,
    [id],
  );
}

async function deleteMongoRow(database, table, id) {
  await database.collection(table.collection).deleteOne({
    _id: ObjectId.createFromHexString(id),
  });
}

async function rebuildMysql(connection) {
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");
  try {
    for (const table of [...tables].reverse()) {
      await connection.query(`DROP TABLE IF EXISTS ${quoteIdentifier(table.name)}`);
    }
  } finally {
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  }

  for (const table of tables) {
    const definitions = table.columns.map(
      ([name, type]) => `${quoteIdentifier(name)} ${type}${name === "id" ? " PRIMARY KEY" : ""}`,
    );
    definitions.push(...table.indexes);
    await connection.query(
      `CREATE TABLE ${quoteIdentifier(table.name)} (${definitions.join(", ")}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    );
  }
}

async function createMysqlDatabase(connectionUrl, databaseName) {
  const serverUrl = new URL(connectionUrl);
  serverUrl.pathname = "/";
  const connection = await mysql.createConnection(serverUrl.toString());
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(databaseName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
}

async function openMysqlDatabase(connectionUrl, databaseName) {
  let connection = mysql.createPool(connectionUrl);
  try {
    await connection.query("SELECT 1");
    return connection;
  } catch (error) {
    await connection.end();
    if (error.code !== "ER_BAD_DB_ERROR") throw error;
  }

  await createMysqlDatabase(connectionUrl, databaseName);
  connection = mysql.createPool(connectionUrl);
  await connection.query("SELECT 1");
  return connection;
}

async function hasAllMysqlTables(connection) {
  const [rows] = await connection.query(
    "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()",
  );
  const existingTables = new Set(rows.map((row) => row.TABLE_NAME));
  return tables.every((table) => existingTables.has(table.name));
}

function snapshot(rows) {
  return Object.fromEntries(
    [...rows.entries()].map(([id, row]) => [
      id,
      { hash: hashRow(row), timestamp: rowTimestamp(row) },
    ]),
  );
}

async function initialCopy(database, connection) {
  console.log("Initializing MySQL application tables from MongoDB.");
  await rebuildMysql(connection);
  const snapshots = {};
  for (const table of tables) {
    const rows = await readMongoRows(database, table);
    for (const row of rows.values()) await writeMysqlRow(connection, table, row);
    const mysqlRows = await readMysqlRows(connection, table);
    snapshots[table.name] = { mongo: snapshot(rows), mysql: snapshot(mysqlRows) };
    console.log(`Initialized ${table.name}: ${rows.size} row(s)`);
  }
  return { version: 1, tables: snapshots };
}

function pickWinner(mongoRowValue, mysqlRowValue, oldMongo, oldMysql) {
  if (!mongoRowValue) {
    return mysqlRowValue && rowTimestamp(mysqlRowValue) >
      (oldMongo?.timestamp ?? "")
      ? "mysql"
      : "mongo";
  }
  if (!mysqlRowValue) {
    return rowTimestamp(mongoRowValue) >
      (oldMysql?.timestamp ?? "")
      ? "mongo"
      : "mysql";
  }
  const mongoTimestamp = rowTimestamp(mongoRowValue);
  const mysqlTimestamp = rowTimestamp(mysqlRowValue);
  if (mongoTimestamp && mysqlTimestamp && mongoTimestamp !== mysqlTimestamp) {
    return mongoTimestamp > mysqlTimestamp ? "mongo" : "mysql";
  }
  return "mongo";
}

async function planTable(database, connection, table, previous) {
  const mongoRows = await readMongoRows(database, table);
  const mysqlRows = await readMysqlRows(connection, table);
  const oldTable = previous?.tables?.[table.name] ?? { mongo: {}, mysql: {} };
  const previousMongo = oldTable.mongo ?? {};
  const previousMysql = oldTable.mysql ?? {};
  const allIds = new Set([
    ...Object.keys(previousMongo),
    ...Object.keys(previousMysql),
    ...mongoRows.keys(),
    ...mysqlRows.keys(),
  ]);
  const plans = [];

  for (const id of allIds) {
    const mongoValue = mongoRows.get(id);
    const mysqlValue = mysqlRows.get(id);
    const oldMongo = previousMongo[id];
    const oldMysql = previousMysql[id];
    const mongoChanged = (mongoValue ? hashRow(mongoValue) : null) !== (oldMongo?.hash ?? null);
    const mysqlChanged = (mysqlValue ? hashRow(mysqlValue) : null) !== (oldMysql?.hash ?? null);
    if (!mongoChanged && !mysqlChanged) continue;

    let source;
    let row;
    if (mongoChanged && !mysqlChanged) {
      source = "mongo";
      row = mongoValue ?? null;
    } else if (mysqlChanged && !mongoChanged) {
      source = "mysql";
      row = mysqlValue ?? null;
    } else {
      source = pickWinner(mongoValue, mysqlValue, oldMongo, oldMysql);
      row = (source === "mongo" ? mongoValue : mysqlValue) ?? null;
    }

    plans.push({ id, source, row });
  }

  return plans;
}

async function main() {
  const mongoDatabaseName = new URL(mongoUrl).pathname.slice(1);
  const mysqlConnectionUrl = new URL(mysqlUrl);
  if (decodeURIComponent(mongoDatabaseName) !== "3rdSpace-inventory") {
    throw new Error("DATABASE_URL must target the 3rdSpace-inventory MongoDB database.");
  }
  if (decodeURIComponent(mysqlConnectionUrl.pathname.slice(1)) !== "3rdspace_inventory") {
    throw new Error("MYSQL_DATABASE_URL must target the 3rdspace_inventory MySQL database.");
  }
  const mongoClient = new MongoClient(mongoUrl);
  const mongoDatabase = mongoClient.db(decodeURIComponent(mongoDatabaseName));
  mysqlConnectionUrl.searchParams.set("timezone", "Z");
  const connection = await openMysqlDatabase(
    mysqlConnectionUrl.toString(),
    "3rdspace_inventory",
  );
  let stopping = false;
  const requestStop = () => {
    stopping = true;
    console.log("Stopping database sync after the current pass.");
  };
  process.once("SIGINT", requestStop);
  process.once("SIGTERM", requestStop);

  try {
    await mongoClient.connect();
    console.log(`Connected. Polling MongoDB and MySQL every ${pollInterval}ms.`);
    let state = await loadState();
    if (!state || !(await hasAllMysqlTables(connection))) {
      await clearState();
      state = await initialCopy(mongoDatabase, connection);
    }
    await saveState(state);

    while (!stopping) {
      try {
        const plansByTable = new Map();
        for (const table of tables) {
          plansByTable.set(
            table.name,
            await planTable(mongoDatabase, connection, table, state),
          );
        }

        let totalChanges = 0;
        for (const table of [...tables].reverse()) {
          for (const plan of plansByTable.get(table.name) ?? []) {
            if (plan.row === null) {
              if (plan.source === "mongo") await deleteMysqlRow(connection, table, plan.id);
              else await deleteMongoRow(mongoDatabase, table, plan.id);
              totalChanges += 1;
            }
          }
        }
        for (const table of tables) {
          for (const plan of plansByTable.get(table.name) ?? []) {
            if (plan.row !== null) {
              if (plan.source === "mongo") await writeMysqlRow(connection, table, plan.row);
              else await writeMongoRow(mongoDatabase, table, plan.row);
              totalChanges += 1;
            }
          }
        }

        const nextState = { version: 1, tables: {} };
        for (const table of tables) {
          const [mongoRows, mysqlRows] = await Promise.all([
            readMongoRows(mongoDatabase, table),
            readMysqlRows(connection, table),
          ]);
          nextState.tables[table.name] = {
            mongo: snapshot(mongoRows),
            mysql: snapshot(mysqlRows),
          };
        }
        state = nextState;
        await saveState(state);
        if (totalChanges > 0) {
          console.log(`Synchronized ${totalChanges} changed record(s).`);
        }
      } catch (error) {
        console.error("Sync pass failed; will retry:", error);
      }
      if (!stopping) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }
  } finally {
    await connection.end();
    await mongoClient.close();
  }
}

main().catch((error) => {
  console.error("Database sync failed:", error);
  process.exitCode = 1;
});
