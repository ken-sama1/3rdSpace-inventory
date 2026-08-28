import { prisma } from "@repo/database";
import type {
  GetInventoryItemsResult,
  InventoryItemFilterSchema,
  InventoryItemOptionsSchema,
} from "@repo/shared";
import {
  toDateFilter,
  toInFilter,
  toNumberFilter,
  toStringFilter,
} from "../utils/filter.mapper.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const list = async (
  filter?: InventoryItemFilterSchema,
  options?: InventoryItemOptionsSchema
): Promise<GetInventoryItemsResult> => {
  const {
    categoryId = null,
    name = null,
    description = null,
    quantity = null,
    createdAt = null,
    unit = null,
  } = filter ?? {};
  const {
    lastItemId = null,
    sortBy = "quantity",
    order = "asc",
  } = options ?? {};
  const result = await prisma.inventoryItem.findMany({
    where: {
      ...(name !== null && {
        name: {
          ...toStringFilter(name),
          mode: "insensitive",
        },
      }),
      ...(quantity !== null && {
        quantity: {
          ...toNumberFilter(quantity),
        },
      }),
      ...(categoryId !== null && { categoryId: toInFilter(categoryId) }),
      ...(unit !== null && { unit: toInFilter(unit) }),
      ...(description !== null && {
        description: {
          ...toStringFilter(description),
          mode: "insensitive",
        },
      }),
      ...(createdAt !== null && {
        createdAt: {
          ...toDateFilter(createdAt),
        },
      }),
    },
    include: {
      category: true,
    },
    ...(sortBy && {
      orderBy: {
        [sortBy]: order,
      },
    }),
    ...(lastItemId && {
      cursor: {
        id: lastItemId,
      },
    }),
  });

  return result.map(toInventoryItemDto);
};
