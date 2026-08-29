import { prisma } from "@repo/database";
import type { GetProductCategoriesResult } from "@repo/shared";
import { toProductCategoryWithProductsDto } from "../utils/product-category.mapper.js";

export const list = async (): Promise<GetProductCategoriesResult> => {
  const result = await prisma.productCategory.findMany({
    include: {
      products: {
        include: {
          recipeItems: {
            include: {
              inventoryItem: true,
            },
          },
        },
      },
    },
  });

  return result.map(toProductCategoryWithProductsDto);
};
