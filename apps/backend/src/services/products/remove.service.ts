import { prisma } from "@repo/database";
import type { DeleteProductResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const remove = async (id: IdSchema): Promise<DeleteProductResult> => {
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
