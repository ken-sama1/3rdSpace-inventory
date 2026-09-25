import { prisma } from "@repo/database";
import type {
  GetInventoryItemCategoriesReqQuerySchema,
  GetInventoryItemCategoriesResult,
} from "@repo/shared";
import { toInventoryItemCategoryWithItemsDto } from "../mappers/inventory-item-category.mapper.js";
import { toStringFilter } from "../mappers/filter.mapper.js";

export const list = async ({
  filter,
}: GetInventoryItemCategoriesReqQuerySchema = {}): Promise<GetInventoryItemCategoriesResult> => {
  const { name = null } = filter ?? {};
  const result = await prisma.inventoryItemCategory.findMany({
    include: {
      inventoryItems: true,
    },
    where: {
      ...(name !== null && {
        name: {
          ...toStringFilter(name),
          mode: "insensitive",
        },
      }),
    },
  });

  return result.map(toInventoryItemCategoryWithItemsDto);
};
