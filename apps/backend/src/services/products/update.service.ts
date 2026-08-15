import { prisma } from "@repo/database";
import type { UpdateProductResult, UpdateProductSchema } from "@repo/shared";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const update = async (
  id: string,
  data: UpdateProductSchema
): Promise<UpdateProductResult> => {
  const { category, description, name, price, imageUrl, recipeItems } = data;

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(name !== undefined && name !== null && { name }),
      ...(price !== undefined && { price }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(!recipeItems !== undefined && {
        recipeItems: {
          deleteMany: {},
          createMany: {
            data: recipeItems ?? [],
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
