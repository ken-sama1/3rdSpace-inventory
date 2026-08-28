import type { Product, ProductCategory, RecipeItem } from "@repo/database";
import type {
  ProductCategoryDto,
  ProductCategoryWithProductsDto,
} from "@repo/shared";
import {
  toProductDto,
  type ToProductWithInventoryItemsDtoInput,
} from "./product.mapper.js";

type ToProductCategoryWithProductDtoInput = ProductCategory & {
  products: ToProductWithInventoryItemsDtoInput[];
};

export const toProductCategoryDto = (
  category: ProductCategory
): ProductCategoryDto => {
  return {
    id: category.id,
    name: category.name,
  };
};

export const toProductCategoryWithProductsDto = ({
  products,
  id,
  name,
}: ToProductCategoryWithProductDtoInput): ProductCategoryWithProductsDto => {
  return {
    id,
    name,
    products: products.map(toProductDto),
  };
};
