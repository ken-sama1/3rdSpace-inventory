import { prisma } from "../src/index.js";

const indexes = [
  {
    collection: "users",
    definitions: [{ key: { role: 1 }, name: "users_role_1" }],
  },
  {
    collection: "inventory_items",
    definitions: [
      { key: { quantity: 1 }, name: "inventory_items_quantity_1" },
      {
        key: { categoryId: 1, quantity: 1 },
        name: "inventory_items_categoryId_1_quantity_1",
      },
    ],
  },
  {
    collection: "products",
    definitions: [
      { key: { name: 1 }, name: "products_name_1" },
      { key: { price: 1 }, name: "products_price_1" },
      {
        key: { categoryId: 1, name: 1 },
        name: "products_categoryId_1_name_1",
      },
    ],
  },
  {
    collection: "transactions",
    definitions: [
      { key: { createdAt: 1 }, name: "transactions_createdAt_1" },
    ],
  },
  {
    collection: "transaction_items",
    definitions: [
      {
        key: { transactionId: 1 },
        name: "transaction_items_transactionId_1",
      },
      { key: { productId: 1 }, name: "transaction_items_productId_1" },
    ],
  },
  {
    collection: "recipe_items",
    definitions: [
      { key: { productId: 1 }, name: "recipe_items_productId_1" },
      {
        key: { inventoryItemId: 1 },
        name: "recipe_items_inventoryItemId_1",
      },
    ],
  },
  {
    collection: "inventory_logs",
    definitions: [
      { key: { createdAt: 1 }, name: "inventory_logs_createdAt_1" },
      {
        key: { inventoryItemId: 1, createdAt: 1 },
        name: "inventory_logs_inventoryItemId_1_createdAt_1",
      },
      {
        key: { sourceType: 1, sourceId: 1 },
        name: "inventory_logs_sourceType_1_sourceId_1",
      },
    ],
  },
] as const;

const main = async (): Promise<void> => {
  for (const { collection, definitions } of indexes) {
    console.info(`Setting up indexes for ${collection}`);
    await prisma.$runCommandRaw({
      createIndexes: collection,
      indexes: definitions,
    });
    console.info(`Finished setting up indexes for ${collection}`);
  }
};

try {
  await main();
} finally {
  await prisma.$disconnect();
}
