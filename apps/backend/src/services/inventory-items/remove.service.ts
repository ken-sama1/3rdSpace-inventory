import { prisma } from "@repo/database";
import type { DeleteInventoryResult } from "@repo/shared";

export const remove = async (id: string): Promise<DeleteInventoryResult> => {
  const {
    id: itemId,
    createdAt,
    updatedAt,
    ...rest
  } = await prisma.inventoryItem.delete({
    where: {
      id,
    },
  });

  return {
    itemId,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    ...rest,
  };
};
