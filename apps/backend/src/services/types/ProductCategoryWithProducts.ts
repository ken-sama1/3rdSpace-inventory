import type { ProductCategory } from "@repo/database";
import type { ProductWithInventoryItems } from "./ProductWithInventoryItems.js";

export interface ProductCategoryWithProducts extends ProductCategory {
  products: Omit<ProductWithInventoryItems, "category">[];
}
