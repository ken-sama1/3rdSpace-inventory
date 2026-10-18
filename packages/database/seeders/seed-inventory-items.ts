import { Prisma } from "@prisma/client";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { prisma } from "../src/index.js";

const inventoryItems: Prisma.InventoryItemCreateManyInput[] = [
  { name: "Coffee Beans" },
  { name: "Full Cream Milk" },
  { name: "Oat Milk" },
  { name: "Sweetened Milk" },
  { name: "Bunge Whipping Cream" },
  { name: "DV Chocolate Sauce" },
  { name: "DV White Choco Sauce" },
  { name: "DV Caramel Sauce" },
  { name: "DV Salted Caramel Sauce" },
  { name: "DV Caramel Syrup" },
  { name: "DV Vanilla Syrup" },
  { name: "DV Hazelnut Syrup" },
  { name: "DV Roasted Almond Syrup" },
  { name: "Biscoff Smooth" },
  { name: "Biscoff Biscuit" },
  { name: "Honey" },
  { name: "Matcha Powder" },
  { name: "Chocolate Powder" },
  { name: "Sea salt" },
  { name: "BS Honey Peach" },
];

export const seedInventoryItems = async () => {
  const rl = createInterface({
    input: stdin,
    output: stdout,
  });

  while (true) {
    const command = await rl.question("Seed inventory items? [y/n]: ");

    if (command !== "y" && command !== "n") continue;

    if (command === "n") {
      console.log("Skipping inventory items");
      break;
    }

    try {
      const inventoryItemsCount = await prisma.inventoryItem.count();

      if (inventoryItemsCount) {
        console.log(
          "Failed: This script is only meant to populate inventory items during initial setup"
        );
        break;
      }

      await prisma.inventoryItem.createMany({
        data: inventoryItems,
      });

      console.log("Done seeding inventory items");
    } catch (error) {
      console.log("Failed to seed inventory items", error);
    }
  }

  rl.close();
};
