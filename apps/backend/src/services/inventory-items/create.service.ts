import { prisma } from "@repo/database";
import type {
  CreateInventoryItemResult,
  CreateInventoryItemSchema,
} from "@repo/shared";
import { toInventoryItemDto } from "../utils/inventory-item.mapper.js";
import { AppError } from "../../errors/AppError.js";

export const create = async ({
  categoryId,
  ...data
}: CreateInventoryItemSchema): Promise<CreateInventoryItemResult> => {
  if (categoryId) {
    const category = await prisma.inventoryItemCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
      },
    });

    if (!category)
      throw new AppError({
        message: "Inventory item category not found",
        code: "NOT_FOUND",
      });
  }
  const result = await prisma.inventoryItem.create({
    data: {
      ...data,
    },
  });

  return toInventoryItemDto(result);
};
