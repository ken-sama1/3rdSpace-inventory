import { prisma } from "@repo/database";
import type {
  IdSchema,
  StockOutInventoryItemResult,
  StockOutInventoryItemSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const stockOut = async (
  id: IdSchema,
  { quantity, reason }: StockOutInventoryItemSchema
): Promise<StockOutInventoryItemResult> => {
  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({
      where: { id },
      select: { quantity: true, name: true },
    });

    if (!item)
      throw new AppError({ message: "Item not found", code: "NOT_FOUND" });

    if (quantity > item.quantity) {
      throw new AppError({
        message: "Stock insufficient",
        code: "STOCK_INSUFFICIENT",
      });
    }

    const updatedItem = await tx.inventoryItem.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
      include: {
        category: true,
      },
    });

    await tx.inventoryLog.create({
      data: {
        inventoryItemId: id,
        quantityChange: -Math.abs(quantity),
        itemName: item.name,
        reason,
      },
    });

    return toInventoryItemDto(updatedItem);
  });

  return result;
};
