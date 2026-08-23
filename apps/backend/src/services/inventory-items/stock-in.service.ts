import { prisma } from "@repo/database";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";
import type {
  StockInInventoryItemResult,
  StockInInventoryItemSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";

export const stockIn = async (
  id: string,
  { quantity }: StockInInventoryItemSchema
): Promise<StockInInventoryItemResult> => {
  const item = await prisma.inventoryItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!item)
    throw new AppError({
      message: "Item not found",
      code: "NOT_FOUND",
    });

  const [result] = await prisma.$transaction([
    prisma.inventoryItem.update({
      where: {
        id,
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    }),
    prisma.inventoryLog.create({
      data: {
        inventoryItemId: id,
        quantityChange: quantity,
        reason: `Stock in`,
      },
    }),
  ]);

  return toInventoryItemDto(result);
};
