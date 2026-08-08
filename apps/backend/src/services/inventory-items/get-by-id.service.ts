import { prisma } from "@repo/database";
import type { GetInventoryItemResult } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";

export const getById = async (id: string): Promise<GetInventoryItemResult> => {
  const result = await prisma.inventoryItem.findUnique({
    where: {
      id,
    },
  });

  if (!result) throw new AppError("Item not found", 404);

  const { id: itemId, createdAt, updatedAt, ...rest } = result;

  return {
    itemId,
    createdAt: createdAt?.toISOString(),
    updatedAt: updatedAt?.toISOString(),
    ...rest,
  };
};
