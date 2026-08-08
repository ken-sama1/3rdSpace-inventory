import { prisma } from "@repo/database";
import type {
  UpdateInventoryItemSchema,
  UpdateInventoryResult,
} from "@repo/shared";

export const update = async (
  id: string,
  data: UpdateInventoryItemSchema
): Promise<UpdateInventoryResult> => {
  const { name, description, imageUrl, unit, quantity } = data;

  const { id: itemId, ...rest } = await prisma.inventoryItem.update({
    where: {
      id,
    },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(unit && { unit }),
      ...(quantity !== undefined && { quantity }),
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    itemId,
    ...rest,
  };
};
