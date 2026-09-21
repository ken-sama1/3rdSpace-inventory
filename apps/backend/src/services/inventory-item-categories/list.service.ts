import { prisma } from "@repo/database";
import type { GetInventoryItemCategoriesResult } from "@repo/shared";
import { toInventoryItemCategoryWithItemsDto } from "../mappers/inventory-item-category.mapper.js";

export const list = async (): Promise<GetInventoryItemCategoriesResult> => {
  const result = await prisma.inventoryItemCategory.findMany({
    include: {
      inventoryItems: true,
    },
  });

  return result.map(toInventoryItemCategoryWithItemsDto);
};
