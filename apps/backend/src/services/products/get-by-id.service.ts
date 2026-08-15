import { prisma } from "@repo/database";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";
import { AppError } from "../../errors/AppError.js";

export const getById = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      recipeItems: {
        include: {
          inventoryItem: true,
        },
      },
    },
  });

  if (!result) throw new AppError("Product not found", 404);

  return toProductWithInventoryItemsDto(result);
};
