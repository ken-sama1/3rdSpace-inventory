import { prisma } from "@repo/database";
import type { GetProductByIdResult, IdSchema } from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const getById = async (id: IdSchema): Promise<GetProductByIdResult> => {
  const result = await prisma.product.findUnique({
    where: {
      id,
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
      category: true,
    },
  });

  if (!result)
    throw new AppError({
      message: "Product not found",
      code: "NOT_FOUND",
    });

  return toProductWithInventoryItemsDto(result);
};
