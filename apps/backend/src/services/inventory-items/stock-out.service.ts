import { prisma } from "@repo/database";
import type {
  StockOutInventoryItemResult,
  StockOutInventoryItemSchema,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const stockOut = async (
  id: string,
  { quantity, reason }: StockOutInventoryItemSchema
): Promise<StockOutInventoryItemResult> => {
  const [result] = await prisma.$transaction([
    prisma.inventoryItem.update({
      where: {
        id,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    }),
    prisma.inventoryLog.create({
      data: {
        inventoryItemId: id,
        quantityChange: -Math.abs(quantity),
        reason,
      },
    }),
  ]);

  return toInventoryItemDto(result);
};
