import { prisma } from "@repo/database";
import type {
  CreateInventoryItemResult,
  CreateInventoryItemSchema,
} from "@repo/shared";

export const create = async (
  data: CreateInventoryItemSchema,
): Promise<CreateInventoryItemResult> => {
  const result = await prisma.inventoryItem.create({
    data: {
      ...data,
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

  return result;
};
