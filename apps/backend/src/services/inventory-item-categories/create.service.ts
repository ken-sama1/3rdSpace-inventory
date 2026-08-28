import { prisma } from "@repo/database";
import type {
  CreateInventoryItemCategoryResult,
  CreateInventoryItemCategorySchema,
} from "@repo/shared";
import { toInventoryItemCategoryDto } from "../utils/inventory-item-category.mappper.js";

export const create = async (
  data: CreateInventoryItemCategorySchema
): Promise<CreateInventoryItemCategoryResult> => {
  const result = await prisma.inventoryItemCategory.create({
    data: {
      name: data.name,
    },
  });

  return toInventoryItemCategoryDto(result);
};
