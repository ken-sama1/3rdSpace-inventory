import { prisma } from "@repo/database";
import type {
  GetInventoryItemsResult,
  InventoryItemFilterSchema,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";
import {
  toStringFilter,
  toNumberFilter,
  toInFilter,
  toDateFilter,
} from "../utils/filter.mapper.js";

export const list = async (
  filter?: InventoryItemFilterSchema
): Promise<GetInventoryItemsResult> => {
  const {
    categoryId = null,
    name = null,
    description = null,
    quantity = null,
    createdAt = null,
    unit = null,
  } = filter ?? {};
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
  });

  return result.map(toInventoryItemDto);
};
