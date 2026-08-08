import type { InventoryItemUnit } from "./schema.js";

export type InventoryItemDto = {
  itemId: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: InventoryItemUnit;
  imageUrl: string | null;
};
