import { prisma } from "@repo/database";
import type {
  IdSchema,
  UpdateProductResult,
  UpdateProductSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const update = async (
  id: IdSchema,
  data: UpdateProductSchema
): Promise<UpdateProductResult> => {
  const {
    categoryId = undefined,
    description = undefined,
    name = undefined,
    price = undefined,
    imageUrl = undefined,
    recipeItems = undefined,
  } = data;

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

  const result = await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      ...(categoryId !== undefined && { categoryId }),
      ...(description !== undefined && { description }),
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(recipeItems !== undefined && {
        recipeItems: {
          deleteMany: {},
          ...(recipeItems.length >= 1 && {
            createMany: {
              data: recipeItems,
            },
          }),
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
