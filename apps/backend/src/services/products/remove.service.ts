import { prisma } from "@repo/database";
import { toProductWithInventoryItemsDto } from "../utils/product.mapper.js";

export const remove = async (id: string) => {
  const result = await prisma.product.delete({
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

  return toProductWithInventoryItemsDto(result);
};
