import type { ObjectIdSchema } from "../common/schema.js";
import type { InventoryItemUnit } from "./schema.js";

export interface InventoryItemDto {
  id: ObjectIdSchema;
  name: string;
  description: string | null;
  quantity: number;
  unit: InventoryItemUnit;
  imageUrl: string | null;
  category: string | null;
}
