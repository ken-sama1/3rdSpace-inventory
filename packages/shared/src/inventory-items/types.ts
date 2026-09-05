import type { IdSchema, ObjectIdSchema } from "../common/schema.js";
import type { InventoryItemCategoryDto } from "../inventory-item-categories/types.js";
import type { InventoryItemUnit } from "./schema.js";

export interface InventoryItemDto {
  id: ObjectIdSchema;
  name: string;
  description: string | null;
  quantity: number;
  unit: InventoryItemUnit;
  imageUrl: string | null;
  categoryId: IdSchema | null;
  category: InventoryItemCategoryDto | null;
}
