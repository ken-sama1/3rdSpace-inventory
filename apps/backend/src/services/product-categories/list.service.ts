import { prisma } from "@repo/database";
import type {
  GetProductCategoriesReqQuerySchema,
  GetProductCategoriesResult,
} from "@repo/shared";
import { toProductCategoryWithProductsDto } from "../mappers/product-category.mapper.js";
import { toStringFilter } from "../mappers/filter.mapper.js";

export const list = async ({
  filter,
}: GetProductCategoriesReqQuerySchema = {}): Promise<GetProductCategoriesResult> => {
  const { name = null } = filter ?? {};
  const result = await prisma.productCategory.findMany({
    where: {
      ...(name !== null && {
        name: {
          ...toStringFilter(name),
          mode: "insensitive",
        },
      }),
    },
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
