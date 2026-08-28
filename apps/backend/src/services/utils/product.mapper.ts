import type {
  InventoryItem,
  Product,
  ProductCategory,
  RecipeItem,
} from "@repo/database";
import type {
  PartialSome,
  ProductDto,
  ProductWithInventoryItemsDto,
  RecipeItemDto,
} from "@repo/shared";
import { toInventoryItemDto } from "./inventory-item.mapper.js";

export type ToProductWithInventoryItemsDtoInput = PartialSome<
  Product & { category: ProductCategory },
  "createdAt" | "updatedAt" | "category"
> & {
  recipeItems: (PartialSome<RecipeItem, "productId"> & {
    product?: Product;
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
}: ToProductWithInventoryItemsDtoInput & {
  category?: ProductCategory;
}): ProductDto => {
  return {
    price,
    id,
    category: category?.name ?? null,
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
}: ToProductWithInventoryItemsDtoInput): ProductWithInventoryItemsDto => {
  return {
    id,
    category: category?.name ?? null,
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
