import type { ProductCategory } from "@repo/database";
import type {
  ProductCategoryDto,
  ProductCategoryWithProductsDto,
} from "@repo/shared";
import type { ProductCategoryWithProducts } from "../types/ProductCategoryWithProducts.js";
import { toProductDto } from "./product.mapper.js";

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
}: ProductCategoryWithProducts): ProductCategoryWithProductsDto => {
  return {
    id,
    name,
    products: products.map((product) => {
      const { category, ...rest } = toProductDto(product);
      return { ...rest };
    }),
  };
};
