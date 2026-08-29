import { prisma } from "@repo/database";
import type {
  IdSchema,
  UpdateInventoryItemSchema,
  UpdateInventoryResult,
} from "@repo/shared";
import { AppError } from "../../errors/AppError.js";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";

export const update = async (
  id: IdSchema,
  data: UpdateInventoryItemSchema
): Promise<UpdateInventoryResult> => {
  const { name, description, imageUrl, unit, categoryId } = data;

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
      ...(categoryId && { categoryId }),
    },
    include: {
      category: true,
    },
  });

  return toInventoryItemDto(result);
};
