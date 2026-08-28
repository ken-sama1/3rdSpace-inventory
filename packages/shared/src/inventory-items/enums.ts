import type { SortOrderSchema } from "../common/options-schema.js";
import type { InventoryItemSortBySchema, InventoryItemUnit } from "./schema.js";

export const inventoryItemUnits: InventoryItemUnit[] = [
  "MG",
  "ML",
  "G",
  "KG",
  "PCS",
];

export const inventoryItemSortBy: InventoryItemSortBySchema[] = [
  "quantity",
  "name",
  "unit",
  "category",
];

export const inventoryItemSortOrder: SortOrderSchema[] = ["asc", "desc"];
