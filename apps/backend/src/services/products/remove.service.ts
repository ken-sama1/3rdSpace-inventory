import { prisma } from "@repo/database";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";
import { AppError } from "../../errors/AppError.js";

export const remove = async (id: string) => {
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
          inventoryItem: true,
        },
      },
    },
  });

  return toProductWithInventoryItemsDto(result);
};
