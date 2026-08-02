import {
  PrismaClient,
  type InventoryItem,
  type InventoryItemUnit,
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

export type { InventoryItem, InventoryItemUnit };
