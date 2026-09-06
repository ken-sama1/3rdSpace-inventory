import type { InventoryItem, InventoryItemCategory } from "@repo/database";
import type { InventoryItemDto, PartialSome } from "@repo/shared";
import { toInventoryItemCategoryDto } from "./inventory-item-category.mapper.js";

export const toInventoryItemDto = ({
  id,
  quantity,
  category,
  description,
  imageUrl,
  name,
  unit,
  categoryId,
}: PartialSome<
  InventoryItem & { category: InventoryItemCategory | null },
  "createdAt" | "updatedAt" | "category"
>): InventoryItemDto => {
  return {
    id,
    quantity,
    categoryId,
    category: category ? toInventoryItemCategoryDto(category) : null,
    description,
    imageUrl,
    name,
    unit,
  };
};
