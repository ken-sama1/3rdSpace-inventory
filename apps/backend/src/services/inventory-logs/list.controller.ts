import { prisma } from "@repo/database";
import type {
  GetInventoryLogsResult,
  InventoryLogFilterSchema,
  InventoryLogOptionsInput,
} from "@repo/shared";
import { toDateFilter, toStringFilter } from "../mappers/filter.mapper.js";

export const list = async (
  filter: InventoryLogFilterSchema = {},
  options: InventoryLogOptionsInput = {}
): Promise<GetInventoryLogsResult> => {
  filter;
  options;

  const { lastInventoryLogId = null, order = "asc", sortBy = null } = options;
  const {
    createdAt = null,
    itemName = null,
    sourceId = null,
    reason = null,
    sourceType = null,
  } = filter;

  const result = await prisma.inventoryLog.findMany({
    where: {
      ...(createdAt && { createdAt: toDateFilter(createdAt) }),
      ...(itemName && {
        itemName: {
          ...toStringFilter(itemName),
          mode: "insensitive",
        },
      }),
      ...(reason && { reason: toStringFilter(reason) }),
      ...(sourceType && { sourceType }),
      ...(sourceId && { sourceId }),
    },
    ...(lastInventoryLogId && {
      cursor: {
        id: lastInventoryLogId,
      },
    }),
    ...(sortBy && { orderBy: { [sortBy]: order } }),
  });

  return result.map((res) => {
    return {
      ...res,
      createdAt: res.createdAt.toISOString(),
    };
  });
};
