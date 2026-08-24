import { prisma } from "@repo/database";
import type { GetInventoryItemResult } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const getById = async (id: string): Promise<GetInventoryItemResult> => {
  const result = await prisma.inventoryItem.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!result)
    throw new AppError({
      message: "Item Not Found",
      code: "NOT_FOUND",
    });

  const { createdAt, updatedAt } = result;

  return {
    createdAt: createdAt?.toISOString(),
    updatedAt: updatedAt?.toISOString(),
    ...toInventoryItemDto(result),
  };
};
