import { prisma } from "@repo/database";
import type { UpdateProductResult, UpdateProductSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const update = async (
  id: string,
  data: UpdateProductSchema
): Promise<UpdateProductResult> => {
  const { categoryId, description, name, price, imageUrl, recipeItems } = data;

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

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...(categoryId !== undefined && { categoryId }),
      ...(description !== undefined && { description }),
      ...(name !== undefined && name !== null && { name }),
      ...(price !== undefined && { price }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(recipeItems !== undefined &&
        recipeItems.length >= 1 && {
          recipeItems: {
            deleteMany: {},
            createMany: {
              data: recipeItems,
            },
          },
        }),
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
