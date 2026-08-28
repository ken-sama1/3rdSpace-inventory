import { prisma } from "@repo/database";
import type { DeleteInventoryItemCategoryResult } from "@repo/shared";
import { toInventoryItemCategoryDto } from "../utils/inventory-item-category.mappper.js";
import { AppError } from "../../errors/AppError.js";

export const remove = async (
  id: string
): Promise<DeleteInventoryItemCategoryResult> => {
  const category = await prisma.inventoryItemCategory.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!category)
    throw new AppError({
      message: "Item category not found",
      code: "NOT_FOUND",
    });

  const result = await prisma.inventoryItemCategory.delete({
    where: {
      id,
    },
  });

  return {
    createdAt: result.createAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    ...toInventoryItemCategoryDto(result),
  };
};
