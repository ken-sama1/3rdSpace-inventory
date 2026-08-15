import { prisma } from "@repo/database";
import type { DeleteInventoryResult } from "@repo/shared";

export const remove = async (id: string): Promise<DeleteInventoryResult> => {
  const { createdAt, updatedAt, ...rest } = await prisma.inventoryItem.delete({
    where: {
      id,
    },
  });

  return {
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    ...rest,
  };
};
