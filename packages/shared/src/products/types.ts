import type { InventoryItemUnit } from "../inventory-items/schema.js";
// import type { InventoryItemDto } from "../inventory-items/types.js";
//
export interface RecipeItemDto {
  recipeItemId: string;
  inventoryItemId: string;
  // inventoryItem: InventoryItemDto;
  quantity: number;
  unit: InventoryItemUnit;
}

export interface ProductDto {
  productId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  price: number;
  recipeItems: RecipeItemDto[];
}
