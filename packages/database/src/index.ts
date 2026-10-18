import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

if (!process.env["DATABASE_URL"]) {
  dotenv.config({
    path: "../../.env",
    override: true,
  });
}

export const prisma = new PrismaClient({
  ...(process.env["ENV"] === "dev" && {
    log: ["info", "query", "warn", "error"],
  }),
});

export * from "@prisma/client";
