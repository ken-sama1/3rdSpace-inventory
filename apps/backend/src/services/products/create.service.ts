import { prisma } from "@repo/database";
import type { CreateProductResult, CreateProductSchema } from "@repo/shared";

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
        select: {
          id: true,
          inventoryItemId: true,
          quantity: true,
          unit: true,
        },
      },
    },
  });

  return {
    productId: result.id,
    name: result.name,
    price: result.price ?? 0,
    category: result.category,
    description: result.description,
    imageUrl: result.imageUrl,
    recipeItems: result.recipeItems.map((recipe) => {
      return {
        quantity: recipe.quantity,
        inventoryItemId: recipe.inventoryItemId,
        recipeItemId: recipe.id,
        unit: recipe.unit,
      };
    }),
  };
};
