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
    select: {
      id: true,
      description: true,
      imageUrl: true,
      name: true,
      quantity: true,
      unit: true,
    },
  });

  return { itemId, ...rest };
};
