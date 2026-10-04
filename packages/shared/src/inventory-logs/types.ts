import type { IdSchema, IsoDateSchema } from "../common/schema.js";

export interface InventoryLogDto {
  id: IdSchema;
  inventoryItemId: IdSchema;
  itemName: string;
  quantityChange: number;
  reason: string;
  createdAt: IsoDateSchema;
}
