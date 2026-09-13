import { prisma, type InventoryItem, type Prisma } from "@repo/database";
import type {
  DeductStockForProductResult,
  DeductStockForProductSchema,
  IdSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const deductStockForProduct = async (
  id: IdSchema,
  { quantity: productQuantity, recipeItems }: DeductStockForProductSchema
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

  if (!product)
    throw new AppError({
      message: "Product not found",
      code: "NOT_FOUND",
    });

  const insufficientStocks: {
    name: string;
    required: number;
    available: number;
  }[] = [];

  const inventoryItems = new Map<string, InventoryItem>([]);

  product.recipeItems.map((recipeItem) => {
    inventoryItems.set(recipeItem.inventoryItemId, recipeItem.inventoryItem);
  });

  for (const recipeItem of recipeItems) {
    const inventoryItem = inventoryItems.get(recipeItem.inventoryItemId);
    const requiredQuantity = recipeItem.quantity * productQuantity;
    const stockQuantity = inventoryItem?.quantity ?? 0;

    if (requiredQuantity > stockQuantity)
      insufficientStocks.push({
        name: inventoryItem?.name ?? "Unkown",
        required: recipeItem.quantity,
        available: stockQuantity,
      });
  }

  if (insufficientStocks.length) {
    throw new AppError({
      message: "Stock insufficient",
      code: "STOCK_INSUFFICIENT",
      errors: insufficientStocks,
    });
  }

  const updatedItems = await prisma.$transaction(async (tx) => {
    await tx.inventoryLog.createMany({
      data: recipeItems.map(
        (recipeItem) =>
          ({
            quantityChange: -Math.abs(recipeItem.quantity * productQuantity),
            reason: `Production/Sale of ${product.name}`,
            inventoryItemId: recipeItem.inventoryItemId,
            itemName:
              inventoryItems.get(recipeItem.inventoryItemId)?.name ?? "Unkown",
          }) satisfies Prisma.InventoryLogCreateArgs["data"]
      ),
    });

    await tx.transaction.create({
      data: {
        quantity: productQuantity,
        unitPrice: product.price,
        transactionPrice: product.price * productQuantity,
        productName: product.name,
      },
    });

    return await Promise.all(
      recipeItems.map((recipeItem) => {
        const totalDeduction = recipeItem.quantity * productQuantity;

        return tx.inventoryItem.update({
          where: {
            id: recipeItem.inventoryItemId,
          },
          data: {
            quantity: {
              decrement: totalDeduction,
            },
          },
          include: {
            category: true,
          },
        });
      })
    );
  });

  return updatedItems.map(toInventoryItemDto);
};
