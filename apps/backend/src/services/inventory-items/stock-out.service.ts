import { prisma } from "@repo/database";
import type {
  StockOutInventoryItemResult,
  StockOutInventoryItemSchema,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";
import { AppError } from "../../errors/AppError.js";

export const stockOut = async (
  id: string,
  { quantity, reason }: StockOutInventoryItemSchema
): Promise<StockOutInventoryItemResult> => {
  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({
      where: { id },
      select: { quantity: true },
    });

    if (!item) {
      throw new AppError("Item not found", 404);
    }

    if (quantity > item.quantity) {
      throw new AppError("Insufficient stock available", 400);
    }

    const updatedItem = await tx.inventoryItem.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    await tx.inventoryLog.create({
      data: {
        inventoryItemId: id,
        quantityChange: -Math.abs(quantity),
        reason,
      },
    });

    return toInventoryItemDto(updatedItem);
  });

  return result;
};
