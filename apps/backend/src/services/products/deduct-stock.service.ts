import { prisma, type InventoryItem, type Prisma } from "@repo/database";
import type {
  DeductStockResult,
  DeductStockSchema,
  IdSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../mappers/inventory-item.mapper.js";

export const deductStock = async (
  id: IdSchema,
  { quantity: productQuantity, recipeItems }: DeductStockSchema
): Promise<DeductStockResult> => {
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
    const record = await tx.transaction.create({
      data: {
        transactionItems: {
          create: {
            quantity: productQuantity,
            unitPrice: product.price,
            productName: product.name,
            productId: product.id,
          },
        },

        totalPrice: product.price * productQuantity,
      },
    });

    await tx.inventoryLog.createMany({
      data: recipeItems.map(
        (recipeItem) =>
          ({
            quantityChange: -Math.abs(recipeItem.quantity * productQuantity),
            reason: `Production/Sale of ${product.name}`,
            inventoryItemId: recipeItem.inventoryItemId,
            sourceType: "TRANSACTION",
            sourceId: record.id,
            itemName:
              inventoryItems.get(recipeItem.inventoryItemId)?.name ?? "Unkown",
          }) satisfies Prisma.InventoryLogCreateArgs["data"]
      ),
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
