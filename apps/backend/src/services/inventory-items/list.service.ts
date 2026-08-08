import { prisma } from "@repo/database";
import type { GetInventoryItemsResult } from "@repo/shared";

export const list = async (): Promise<GetInventoryItemsResult> => {
  const result = await prisma.inventoryItem.findMany({
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return result.map(({ id: itemId, ...rest }) => {
    return {
      itemId,
      ...rest,
    };
  });
};
