import { prisma } from "@repo/database";
import type { CreateProductResult, CreateProductSchema } from "@repo/shared";
import { toProductDto } from "../utils/product.mapper.js";
import { AppError } from "../../errors/AppError.js";

export const create = async ({
  categoryId,
  ...data
}: CreateProductSchema): Promise<CreateProductResult> => {
  if (categoryId) {
    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
      },
    });

    if (!category)
      throw new AppError({
        message: "Product category not found",
        code: "NOT_FOUND",
      });
  }

  const result = await prisma.product.create({
    data: {
      name: data.name,
      categoryId: categoryId,
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
