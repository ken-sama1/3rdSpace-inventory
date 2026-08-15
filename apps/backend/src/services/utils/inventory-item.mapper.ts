import type { InventoryItem } from "@repo/database";
import type { InventoryItemDto, PartialSome } from "@repo/shared";

export const toInventoryItemDto = ({
  id,
  quantity,
  category,
  description,
  imageUrl,
  name,
  unit,
}: PartialSome<InventoryItem, "createdAt" | "updatedAt">): InventoryItemDto => {
  return {
    id,
    quantity,
    category,
    description,
    imageUrl,
    name,
    unit,
  };
};
