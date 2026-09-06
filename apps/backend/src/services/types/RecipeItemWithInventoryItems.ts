import type { InventoryItem, RecipeItem } from "@repo/database";

export interface RecipeItemWithInventoryItems extends RecipeItem {
  inventoryItem: InventoryItem;
}
