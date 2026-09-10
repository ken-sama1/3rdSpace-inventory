import { prisma } from "@repo/database";
import type {
  AssignProductsToCategoryResult,
  AssignProductsToCategorySchema,
  IdSchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductDto } from "../utils/product.mapper.js";

export const assignProducts = async (
  id: IdSchema,
  { productIds }: AssignProductsToCategorySchema
): Promise<AssignProductsToCategoryResult> => {
  const category = await prisma.productCategory.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!category)
    throw new AppError({
      message: "Product category not found",
      code: "NOT_FOUND",
    });

  const result = await prisma.$transaction((tx) => {
    return Promise.all(
      productIds.map((productId) => {
        return tx.product.update({
          where: {
            id: productId,
          },
          data: {
            categoryId: category.id,
          },
          include: {
            category: true,
            recipeItems: {
              include: {
                inventoryItem: true,
              },
            },
          },
        });
      })
    );
  });

  return result.map(toProductDto);
};
