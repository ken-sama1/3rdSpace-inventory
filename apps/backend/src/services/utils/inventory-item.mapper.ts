import type { InventoryItem, InventoryItemCategory } from "@repo/database";
import type { InventoryItemDto, PartialSome } from "@repo/shared";

export const toInventoryItemDto = ({
  id,
  quantity,
  category,
  description,
  imageUrl,
  name,
  unit,
}: PartialSome<
  InventoryItem & { category: InventoryItemCategory | null },
  "createdAt" | "updatedAt" | "category"
>): InventoryItemDto => {
  return {
    id,
    quantity,
    category: category?.name ?? null,
    description,
    imageUrl,
    name,
    unit,
  };
};
