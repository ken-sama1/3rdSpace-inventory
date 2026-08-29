import type { IdSchema } from "../common/schema.js";
import type { InventoryItemDto } from "../inventory-items/types.js";

export type InventoryItemCategoryDto = {
  id: IdSchema;
  name: string;
};

export type InventoryItemCategoryWithItemsDto = InventoryItemCategoryDto & {
  inventoryItems: InventoryItemDto[];
};
