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
      name: true,
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
      include: {
        category: true,
      },
    }),
    prisma.inventoryLog.create({
      data: {
        inventoryItemId: id,
        quantityChange: quantity,
        reason: `Stock in`,
        itemName: item.name,
      },
    }),
  ]);

  return toInventoryItemDto(result);
};
