import { prisma } from "@repo/database";
import type {
  IdSchema,
  UpdateInventoryItemCategoryResult,
  UpdateInventoryItemCategorySchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemCategoryDto } from "../utils/inventory-item-category.mapper.js";

export const update = async (
  id: IdSchema,
  { name }: UpdateInventoryItemCategorySchema
): Promise<UpdateInventoryItemCategoryResult> => {
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

  const result = await prisma.inventoryItemCategory.update({
    where: {
      id,
    },
    data: {
      ...(name && { name }),
    },
  });

  return toInventoryItemCategoryDto(result);
};
