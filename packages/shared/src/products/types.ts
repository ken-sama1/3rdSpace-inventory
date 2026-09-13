import type { IdSchema } from "../common/schema.js";
import type { InventoryItemUnitSchema } from "../inventory-items/schema.js";
import type { InventoryItemDto } from "../inventory-items/types.js";
import type { ProductCategoryDto } from "../product-categories/types.js";

export interface RecipeItemDto {
  id: IdSchema;
  inventoryItemId: string;
  quantity: number;
  unit: InventoryItemUnitSchema;
}

export interface RecipeItemWithInventoryItemDto extends RecipeItemDto {
  inventoryItem: InventoryItemDto;
}

export interface ProductDto {
  id: IdSchema;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: IdSchema | null;
  category: ProductCategoryDto | null;
  price: number;
  recipeItems: RecipeItemDto[];
}

export type ProductWithInventoryItemsDto = Omit<ProductDto, "recipeItems"> & {
  recipeItems: RecipeItemWithInventoryItemDto[];
};
