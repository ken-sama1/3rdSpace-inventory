import { prisma } from "@repo/database";
import type { CreateProductResult, CreateProductSchema } from "@repo/shared";
import { toProductDto } from "../utils/product.mapper.js";

export const create = async (
  data: CreateProductSchema
): Promise<CreateProductResult> => {
  const result = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      description: data.description,
      imageUrl: data.imageUrl,
      price: data.price,
      recipeItems: {
        createMany: {
          data: [...data.recipeItems],
        },
      },
    },
    omit: {
      updatedAt: true,
      createdAt: true,
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  return toProductDto(result);
};
