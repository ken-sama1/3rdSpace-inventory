import { prisma } from "@repo/database";
import type {
  IdSchema,
  UnassignProductsFromCategoryResult,
  UnassignProductsFromCategorySchema,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductDto } from "../utils/product.mapper.js";

export const unassignProducts = async (
  id: IdSchema,
  { productIds }: UnassignProductsFromCategorySchema
): Promise<UnassignProductsFromCategoryResult> => {
  const category = await prisma.productCategory.findUnique({
    where: {
      id: id,
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
            categoryId: null,
          },
          include: {
            recipeItems: {
              include: {
                inventoryItem: true,
              },
            },
            category: true,
          },
        });
      })
    );
  });

  return result.map(toProductDto);
};
