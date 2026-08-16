import type { InventoryItemUnit } from "../inventory-items/schema.js";
import type { InventoryItemDto } from "../inventory-items/types.js";

export interface RecipeItemDto {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unit: InventoryItemUnit;
}

export interface RecipeItemWithInventoryItemDto extends RecipeItemDto {
  inventoryItem: InventoryItemDto;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  price: number;
  recipeItems: RecipeItemDto[];
}

export type ProductWithInventoryItemsDto = Omit<ProductDto, "recipeItems"> & {
  recipeItems: RecipeItemWithInventoryItemDto[];
};
