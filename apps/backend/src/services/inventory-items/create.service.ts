import { prisma } from "@repo/database";
import type {
  CreateInventoryItemResult,
  CreateInventoryItemSchema,
} from "@repo/shared";

export const create = async (
  args: CreateInventoryItemSchema
): Promise<CreateInventoryItemResult> => {
  const { id: itemId, ...rest } = await prisma.inventoryItem.create({
    data: {
      ...args,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return { itemId, ...rest };
};
