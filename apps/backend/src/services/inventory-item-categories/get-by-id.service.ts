import { prisma } from "@repo/database";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemCategoryWithItemsDto } from "../utils/inventory-item-category.mapper.js";
import type { IdSchema } from "@repo/shared";

export const getById = async (id: IdSchema) => {
  const result = await prisma.inventoryItemCategory.findUnique({
    where: { id },
    include: {
      inventoryItems: true,
    },
  });

  if (!result)
    throw new AppError({
      message: "Item category not found",
      code: "NOT_FOUND",
    });

  return toInventoryItemCategoryWithItemsDto(result);
};
