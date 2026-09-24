import type {
  InventoryItemSortBySchema,
  InventoryItemUnitSchema,
} from "./schema.js";

export const inventoryItemUnits: InventoryItemUnitSchema[] = [
  "MG",
  "ML",
  "G",
  "KG",
  "PCS",
];

export const inventoryItemSortBy: InventoryItemSortBySchema[] = [
  "quantity",
  "name",
  // "unit",
  "category",
];
