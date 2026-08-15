import { prisma } from "@repo/database";
import type {
  CreateInventoryItemResult,
  CreateInventoryItemSchema,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const create = async (
  args: CreateInventoryItemSchema
): Promise<CreateInventoryItemResult> => {
  const result = await prisma.inventoryItem.create({
    data: {
      ...args,
    },
  });

  return toInventoryItemDto(result);
};
