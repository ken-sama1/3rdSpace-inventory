import { prisma } from "@repo/database";
import type { GetProductsResult, ProductFilterSchema } from "@repo/shared";
import {
  toDateFilter,
  toInFilter,
  toNumberFilter,
  toStringFilter,
} from "../utils/filter.mapper.js";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const list = async (
  filter?: ProductFilterSchema
): Promise<GetProductsResult> => {
  const {
    name = null,
    description = null,
    categoryId = null,
    price = null,
    createdAt = null,
  } = filter ?? {};
  const result = await prisma.product.findMany({
    where: {
      ...(name !== null && {
        name: {
          ...toStringFilter(name),
          mode: "insensitive",
        },
      }),
      ...(description !== null && {
        description: {
          ...toStringFilter(description),
          mode: "insensitive",
        },
      }),
      ...(categoryId !== null && {
        categoryId: toInFilter(categoryId),
      }),
      ...(price !== null && { price: toNumberFilter(price) }),
      ...(createdAt !== null && { createdAt: toDateFilter(createdAt) }),
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  return result.map((res) => {
    return toProductWithInventoryItemsDto(res);
  });
};
