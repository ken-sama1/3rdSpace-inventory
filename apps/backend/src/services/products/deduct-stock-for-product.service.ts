import { prisma, type Prisma } from "@repo/database";
import type {
  DeductStockForProductResult,
  DeductStockForProductSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const deductStockForProduct = async (
  id: string,
  { quantity: productQuantity }: DeductStockForProductSchema
): Promise<DeductStockForProductResult> => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  if (!product) throw new AppError("Product not found", 404);

  const recipeItems = product.recipeItems;

  for (const recipeItem of recipeItems) {
    const requiredQuantity = recipeItem.quantity * productQuantity;
    const stockQuantity = recipeItem.inventoryItem.quantity;

    if (requiredQuantity > stockQuantity)
      throw new AppError(
        `Insufficient stock ${recipeItem.inventoryItem.name}. Required: ${recipeItem.quantity} Available Stock: ${stockQuantity}"`,
        400
      );
  }

  const updatedItems = await prisma.$transaction(async (tx) => {
    await tx.inventoryLog.createMany({
      data: recipeItems.map(
        (item) =>
          ({
            quantityChange: -(item.quantity * productQuantity),
            reason: `Production/Sale of ${product.name}`,
            inventoryItemId: item.inventoryItemId,
            unit: item.inventoryItem.unit,
          }) satisfies Prisma.InventoryLogCreateArgs["data"]
      ),
    });

    return await Promise.all(
      recipeItems.map((item) => {
        const totalDeduction = item.quantity * productQuantity;

        return tx.inventoryItem.update({
          where: {
            id: item.inventoryItemId,
          },
          data: {
            quantity: {
              decrement: totalDeduction,
            },
          },
        });
      })
    );
  });

  return updatedItems.map(toInventoryItemDto);
};
