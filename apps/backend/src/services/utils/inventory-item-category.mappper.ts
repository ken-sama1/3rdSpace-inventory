import { type InventoryItem, type InventoryItemCategory } from "@repo/database";
import type {
  InventoryItemCategoryDto,
  InventoryItemCategoryWithItemsDto,
} from "@repo/shared";
import { toInventoryItemDto } from "./inventory-item.mapper.js";

type ToInventoryItemCategoryWithItemsDtoInput = InventoryItemCategory & {
  inventoryItems: InventoryItem[];
};

export const toInventoryItemCategoryDto = (
  category: InventoryItemCategory
): InventoryItemCategoryDto => {
  return {
    id: category.id,
    name: category.name,
  };
};

export const toInventoryItemCategoryWithItemsDto = (
  category: ToInventoryItemCategoryWithItemsDtoInput & {}
): InventoryItemCategoryWithItemsDto => {
  return {
    name: category.name,
    id: category.id,
    inventoryItems: category.inventoryItems.map(toInventoryItemDto),
  };
};
