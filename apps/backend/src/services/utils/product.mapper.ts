import type {
  ProductDto,
  ProductWithInventoryItemsDto,
  RecipeItemDto,
} from "@repo/shared";
import type { ProductWithInventoryItems } from "../types/ProductWithInventoryItems.js";
import { toInventoryItemDto } from "./inventory-item.mapper.js";
import { toProductCategoryDto } from "./product-category.mapper.js";

export const toProductDto = ({
  id,
  category,
  description,
  name,
  imageUrl,
  price,
  recipeItems,
  categoryId,
}: ProductWithInventoryItems): ProductDto => {
  return {
    price,
    id,
    categoryId,
    category: category ?? null,
    description,
    imageUrl,
    name,
    recipeItems: recipeItems.map((recipeItem) => {
      return {
        id: recipeItem.id,
        inventoryItemId: recipeItem.inventoryItem.id,
        quantity: recipeItem.quantity,
        unit: recipeItem.inventoryItem.unit,
      } satisfies RecipeItemDto;
    }),
  };
};

export const toProductWithInventoryItemsDto = ({
  id,
  category,
  description,
  imageUrl,
  name,
  price,
  recipeItems,
  categoryId,
}: ProductWithInventoryItems): ProductWithInventoryItemsDto => {
  return {
    id,
    categoryId: categoryId,
    category: category ? toProductCategoryDto(category) : null,
    description,
    imageUrl,
    name,
    price,
    recipeItems: recipeItems.map((recipeItem) => {
      return {
        id: recipeItem.id,
        inventoryItemId: recipeItem.inventoryItem.id,
        quantity: recipeItem.quantity,
        unit: recipeItem.inventoryItem.unit,
        inventoryItem: toInventoryItemDto(recipeItem.inventoryItem),
      } satisfies ProductWithInventoryItemsDto["recipeItems"][number];
    }),
  };
};
