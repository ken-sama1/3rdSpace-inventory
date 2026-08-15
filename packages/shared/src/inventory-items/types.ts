import type { InventoryItemUnit } from "./schema.js";

export interface InventoryItemDto {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: InventoryItemUnit;
  imageUrl: string | null;
  category: string | null;
}
