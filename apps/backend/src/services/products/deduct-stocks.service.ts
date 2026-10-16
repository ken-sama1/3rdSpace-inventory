import { prisma, type InventoryItem, type Prisma } from "@repo/database";
import type { DeductStocksResult, DeductStocksSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInFilter } from "../mappers/filter.mapper.js";
import { toInventoryItemDto } from "../mappers/inventory-item.mapper.js";

export const deductStocks = async (
  deductions: DeductStocksSchema
): Promise<DeductStocksResult> => {
  const products = await prisma.product.findMany({
    where: {
      id: toInFilter(deductions.map(({ id }) => id)),
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  if (products.length !== new Set(deductions.map(({ id }) => id)).size) {
    throw new AppError({
      code: "NOT_FOUND",
      message: "Could not find some of the products",
    });
  }

  const productsById = new Map(
    products.map((product) => [product.id, product])
  );

  const inventoryItems = new Map<string, InventoryItem>();

  for (const product of products) {
    for (const recipeItem of product.recipeItems) {
      inventoryItems.set(recipeItem.inventoryItemId, recipeItem.inventoryItem);
    }
  }

  // Total deduction per inventory item across ALL products.
  const itemsDeduction = new Map<string, number>();

  for (const { recipeItems, quantity } of deductions) {
    for (const recipeItem of recipeItems) {
      const requiredQuantity = recipeItem.quantity * quantity;

      const currentDeduction =
        itemsDeduction.get(recipeItem.inventoryItemId) ?? 0;

      itemsDeduction.set(
        recipeItem.inventoryItemId,
        currentDeduction + requiredQuantity
      );
    }
  }

  // Validate the combined deductions, not individual products.
  const insufficientStocks: {
    name: string;
    required: number;
    available: number;
  }[] = [];

  for (const [inventoryItemId, required] of itemsDeduction) {
    const inventoryItem = inventoryItems.get(inventoryItemId);
    const available = inventoryItem?.quantity ?? 0;

    if (!inventoryItem || required > available) {
      insufficientStocks.push({
        name: inventoryItem?.name ?? "Unknown",
        required,
        available,
      });
    }
  }

  if (insufficientStocks.length > 0) {
    throw new AppError({
      code: "STOCK_INSUFFICIENT",
      message: "The calculated total exceeds the available stock",
      errors: insufficientStocks,
    });
  }

  const updatedItems = await prisma.$transaction(async (tx) => {
    const transactionItems = deductions.map(({ id, quantity }) => {
      const product = productsById.get(id)!;

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
      };
    });

    const totalPrice = transactionItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );

    const record = await tx.transaction.create({
      data: {
        totalPrice,
        transactionItems: {
          createMany: {
            data: transactionItems,
          },
        },
      },
    });

    await tx.inventoryLog.createMany({
      data: deductions.flatMap(({ id, quantity, recipeItems }) => {
        const product = productsById.get(id)!;

        return recipeItems.map(
          (recipeItem) =>
            ({
              quantityChange: -Math.abs(recipeItem.quantity * quantity),
              reason: `Production/Sale of ${product.name}`,
              inventoryItemId: recipeItem.inventoryItemId,
              sourceType: "TRANSACTION",
              sourceId: record.id,
              itemName:
                inventoryItems.get(recipeItem.inventoryItemId)?.name ??
                "Unknown",
            }) satisfies Prisma.InventoryLogCreateManyInput
        );
      }),
    });

    return Promise.all(
      [...itemsDeduction].map(([id, quantity]) =>
        tx.inventoryItem.update({
          where: { id },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
          include: {
            category: true,
          },
        })
      )
    );
  });

  return updatedItems.map(toInventoryItemDto);
};
