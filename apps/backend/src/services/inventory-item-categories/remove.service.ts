import { prisma } from "@repo/database";
import type { DeleteInventoryItemCategoryResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemCategoryDto } from "../utils/inventory-item-category.mappper.js";

export const remove = async (
  id: IdSchema
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

  const result = await prisma.$transaction(async (tsx) => {
    await tsx.inventoryItem.updateMany({
      where: {
        categoryId: id,
      },
      data: {
        categoryId: null,
      },
    });

    return await tsx.inventoryItemCategory.delete({
      where: {
        id,
      },
    });
  });

  return {
    createdAt: result.createAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
    ...toInventoryItemCategoryDto(result),
  };
};
