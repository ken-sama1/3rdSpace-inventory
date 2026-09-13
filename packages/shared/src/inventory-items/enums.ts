import type { SortOrderSchema } from "../common/options-schema.js";
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
  "unit",
  "category",
];

export const inventoryItemSortOrder: SortOrderSchema[] = ["asc", "desc"];
