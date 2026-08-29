import type { InventoryItem, InventoryItemCategory } from "@repo/database";

export interface InventoryItemCategoryWithItems extends InventoryItemCategory {
  inventoryItems: InventoryItem[];
}
