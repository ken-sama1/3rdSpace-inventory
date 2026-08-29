import { prisma } from "@repo/database";
import type { GetProductCategoryByIdResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductCategoryWithProductsDto } from "../utils/product-category.mapper.js";

export const getById = async (
  id: IdSchema
): Promise<GetProductCategoryByIdResult> => {
  const result = await prisma.productCategory.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          recipeItems: {
            include: {
              inventoryItem: true,
            },
          },
        },
      },
    },
  });

  if (!result)
    throw new AppError({
      message: "Product category not found",
      code: "NOT_FOUND",
    });

  return toProductCategoryWithProductsDto(result);
};
