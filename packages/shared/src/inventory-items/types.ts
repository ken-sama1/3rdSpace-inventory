import type { IdSchema } from "../common/schema.js";
import type { InventoryItemCategoryDto } from "../inventory-item-categories/types.js";
import type { InventoryItemUnitSchema } from "./schema.js";

export interface InventoryItemDto {
  id: IdSchema;
  name: string;
  description: string | null;
  quantity: number;
  unit: InventoryItemUnitSchema;
  imageUrl: string | null;
  categoryId: IdSchema | null;
  category: InventoryItemCategoryDto | null;
}
