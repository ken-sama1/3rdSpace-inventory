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

  const recipeItems = product.recipeItems;

  for (const recipeItem of recipeItems) {
    const requiredQuantity = recipeItem.quantity * productQuantity;
    const stockQuantity = recipeItem.inventoryItem.quantity;

    if (requiredQuantity > stockQuantity)
      insufficientStocks.push({
        name: recipeItem.inventoryItem.name,
        required: recipeItem.quantity,
        available: recipeItem.inventoryItem.quantity,
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
        (item) =>
          ({
            quantityChange: -Math.abs(item.quantity * productQuantity),
            reason: `Production/Sale of ${product.name}`,
            inventoryItemId: item.inventoryItemId,
          }) satisfies Prisma.InventoryLogCreateArgs["data"]
      ),
    });

    await tx.transaction.create({
      data: {
        quantity: productQuantity,
        unitPrice: product.price,
        transactionPrice: product.price * productQuantity,
        productId: product.id,
      },
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
