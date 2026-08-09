import { prisma } from "@repo/database";
import type { CreateProductSchema } from "@repo/shared";

export const create = async (data: CreateProductSchema) => {
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
    include: {
      recipeItems: true,
    },
  });

  return result;
};
