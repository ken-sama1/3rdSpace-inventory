import { prisma } from "@repo/database";
import type { GetInventoryItemsResult } from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const list = async (): Promise<GetInventoryItemsResult> => {
  const result = await prisma.inventoryItem.findMany({});

  return result.map(toInventoryItemDto);
};
