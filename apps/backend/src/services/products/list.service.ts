import { prisma } from "@repo/database";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";
import type { GetProductsResult } from "@repo/shared";

export const list = async (): Promise<GetProductsResult> => {
  const result = await prisma.product.findMany({
    omit: {
      createdAt: true,
      updatedAt: true,
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  return result.map((res) => {
    return toProductWithInventoryItemsDto(res);
  });
};
