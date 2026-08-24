import {
  PrismaClient,
  type Prisma,
  type Product,
  type RecipeItem,
  type InventoryItem,
  type InventoryItemUnit,
  type InventoryItemCategory,
  type ProductCategory,
} from "@prisma/client";
import dotenv from "dotenv";

if (!process.env["DATABASE_URL"]) {
  dotenv.config({
    path: "../../.env",
    override: true,
  });
}

export const prisma = new PrismaClient({
  log: ["info", "query", "warn", "error"],
});

export type {
  InventoryItem,
  InventoryItemUnit,
  Product,
  RecipeItem,
  ProductCategory,
  InventoryItemCategory,
  Prisma,
};
