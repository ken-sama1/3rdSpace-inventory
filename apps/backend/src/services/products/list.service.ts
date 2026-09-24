import { prisma } from "@repo/database";
import type {
  GetProductsReqQuerySchema,
  GetProductsResult,
} from "@repo/shared";
import {
  toInFilter,
  toNumberFilter,
  toStringFilter,
} from "../mappers/filter.mapper.js";
import { toProductWithInventoryItemsDto } from "../mappers/product.mapper.js";

export const list = async ({
  filter = {},
  options = {},
}: GetProductsReqQuerySchema = {}): Promise<GetProductsResult> => {
  const {
    name = null,
    description = null,
    categoryId = null,
    price = null,
  } = filter ?? {};
  const { order = null, lastProductId = null, sortBy } = options;
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
      category: true,
    },
    ...(sortBy && {
      orderBy: {
        [sortBy]: order,
      },
    }),
    ...(lastProductId && {
      cursor: {
        id: lastProductId,
      },
    }),
  });

  return result.map((res) => {
    return toProductWithInventoryItemsDto(res);
  });
};
