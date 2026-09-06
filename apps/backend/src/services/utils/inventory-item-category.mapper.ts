import { type InventoryItemCategory } from "@repo/database";
import type {
  InventoryItemCategoryDto,
  InventoryItemCategoryWithItemsDto,
} from "@repo/shared";
import type { InventoryItemCategoryWithItems } from "../types/InventoryItemCategoryWithItems.js";
import { toInventoryItemDto } from "./inventory-item.mapper.js";

export const toInventoryItemCategoryDto = (
  category: InventoryItemCategory
): InventoryItemCategoryDto => {
  return {
    id: category.id,
    name: category.name,
  };
};

export const toInventoryItemCategoryWithItemsDto = (
  category: InventoryItemCategoryWithItems
): InventoryItemCategoryWithItemsDto => {
  return {
    name: category.name,
    id: category.id,
    inventoryItems: category.inventoryItems.map(toInventoryItemDto),
  };
};
