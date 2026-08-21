import { prisma } from "@repo/database";
import type {
  UpdateInventoryItemSchema,
  UpdateInventoryResult,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const update = async (
  id: string,
  data: UpdateInventoryItemSchema
): Promise<UpdateInventoryResult> => {
  const { name, description, imageUrl, unit, category } = data;

  const result = await prisma.inventoryItem.update({
    where: {
      id,
    },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(unit && { unit }),
      ...(category && { category }),
    },
  });

  return toInventoryItemDto(result);
};
