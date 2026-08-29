import { prisma } from "@repo/database";
import type { CreateProductResult, CreateProductSchema } from "@repo/shared";
import { toProductDto } from "../utils/product.mapper.js";

export const create = async (
  data: CreateProductSchema
): Promise<CreateProductResult> => {
  const result = await prisma.product.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      imageUrl: data.imageUrl,
      price: data.price,
      ...(data.recipeItems.length && {
        recipeItems: {
          createMany: {
            data: [...data.recipeItems],
          },
        },
      }),
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

  return toProductDto(result);
};
