import { prisma } from "@repo/database";
import type {
  IdSchema,
  UnassignInventoryItemsFromCategorySchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const unassignItems = async (
  id: IdSchema,
  { inventoryItemIds }: UnassignInventoryItemsFromCategorySchema
) => {
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

  const result = await prisma.$transaction(async (tx) => {
    return await Promise.all(
      inventoryItemIds.map(async (itemId) => {
        return await tx.inventoryItem.update({
          where: { id: itemId },
          data: { categoryId: null },
          include: {
            category: true,
          },
        });
      })
    );
  });

  return result.map(toInventoryItemDto);
};
