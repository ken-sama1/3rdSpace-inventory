import type { Product, ProductCategory } from "@repo/database";
import type { RecipeItemWithInventoryItems } from "./RecipeItemWithInventorItems.js";

export interface ProductWithInventoryItems extends Product {
  recipeItems: RecipeItemWithInventoryItems[];
  category?: ProductCategory | null;
}
