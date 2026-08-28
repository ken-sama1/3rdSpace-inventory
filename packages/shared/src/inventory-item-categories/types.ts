import type { InventoryItemDto } from "../inventory-items/types.js";

export type InventoryItemCategoryDto = {
  id: string;
  name: string;
};

export type InventoryItemCategoryWithItemsDto = InventoryItemCategoryDto & {
  inventoryItems: InventoryItemDto[];
};
