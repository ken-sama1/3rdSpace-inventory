import { prisma } from "@repo/database";
import type {
  UpdateInventoryItemSchema,
  UpdateInventoryResult,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";
import { AppError } from "../../errors/AppError.js";

export const update = async (
  id: string,
  data: UpdateInventoryItemSchema
): Promise<UpdateInventoryResult> => {
  const { name, description, imageUrl, unit, category } = data;

  const item = await prisma.inventoryItem.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!item)
    throw new AppError({ message: "Item not found", code: "NOT_FOUND" });

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
