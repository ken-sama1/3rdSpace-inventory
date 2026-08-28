import { prisma } from "@repo/database";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";
import { AppError } from "../../errors/AppError.js";
import type { DeleteProductResult } from "@repo/shared";

export const remove = async (id: string): Promise<DeleteProductResult> => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!product)
    throw new AppError({
      message: "Product not found",
      code: "NOT_FOUND",
    });

  const result = await prisma.product.delete({
    where: {
      id,
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  return {
    createdAt: result.createdAt?.toISOString(),
    updatedAt: result.updatedAt?.toISOString(),
    ...toProductWithInventoryItemsDto(result),
  };
};
