import { prisma } from "@repo/database";
import type { DeleteInventoryResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const remove = async (id: IdSchema): Promise<DeleteInventoryResult> => {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: {
      recipeItems: {
        select: {
          productId: true,
        },
      },
    },
  });

  if (!item)
    throw new AppError({
      message: "Item not found",
      code: "NOT_FOUND",
    });

  if (item.recipeItems.length)
    throw new AppError({
      message: `This item cannot be deleted because it is associated with ${item.recipeItems.length} products`,
      code: "ITEM_IN_USE",
      errors: [
        ...item.recipeItems.map((recipeItem) => {
          return {
            productId: recipeItem.productId,
          };
        }),
      ],
    });

  const { createdAt, updatedAt, ...rest } = await prisma.inventoryItem.delete({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  return {
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    ...toInventoryItemDto(rest),
  };
};
