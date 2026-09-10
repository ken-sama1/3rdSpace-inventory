import { prisma } from "@repo/database";
import type {
  AssignInventoryItemsToCategoryResult,
  AssignInventoryItemsToCategorySchema,
  IdSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const assignItems = async (
  id: IdSchema,
  { inventoryItemIds }: AssignInventoryItemsToCategorySchema
): Promise<AssignInventoryItemsToCategoryResult> => {
  const category = await prisma.inventoryItemCategory.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  if (!category)
    throw new AppError({
      code: "NOT_FOUND",
      message: "Item category not found",
    });

  const result = await prisma.$transaction(async (tx) => {
    return await Promise.all(
      inventoryItemIds.map(async (itemId) => {
        return await tx.inventoryItem.update({
          where: { id: itemId },
          data: { categoryId: category.id },
          include: {
            category: true,
          },
        });
      })
    );
  });

  return result.map(toInventoryItemDto);
};
