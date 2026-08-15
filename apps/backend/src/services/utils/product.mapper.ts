import type { InventoryItem, Product, RecipeItem } from "@repo/database";
import type {
  PartialSome,
  ProductDto,
  ProductWithInventoryItemsDto,
  RecipeItemDto,
} from "@repo/shared";
import { toInventoryItemDto } from "./inventory-item.mapper.js";

type ToProductWithInventoryItemsDto = PartialSome<
  Product,
  "createdAt" | "updatedAt"
> & {
  recipeItems: (PartialSome<RecipeItem, "productId"> & {
    product?: ProductDto;
    inventoryItem: PartialSome<InventoryItem, "createdAt" | "updatedAt">;
  })[];
};

export const toProductDto = ({
  id,
  category,
  description,
  name,
  imageUrl,
  price,
  recipeItems,
}: ToProductWithInventoryItemsDto): ProductDto => {
  return {
    price,
    id,
    category,
    description,
    imageUrl,
    name,
    recipeItems: recipeItems.map((recipeItem) => {
      return {
        id: recipeItem.id,
        inventoryItemId: recipeItem.inventoryItemId,
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
}: ToProductWithInventoryItemsDto): ProductWithInventoryItemsDto => {
  return {
    id,
    category,
    description,
    imageUrl,
    name,
    price,
    recipeItems: recipeItems.map((recipeItem) => {
      return {
        id: recipeItem.id,
        inventoryItemId: recipeItem.inventoryItemId,
        quantity: recipeItem.quantity,
        unit: recipeItem.inventoryItem.unit,
        inventoryItem: toInventoryItemDto(recipeItem.inventoryItem),
      } satisfies ProductWithInventoryItemsDto["recipeItems"][number];
    }),
  };
};
