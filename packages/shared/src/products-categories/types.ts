import type { ProductDto } from "../products/types.js";

export type ProductCategoryDto = {
  id: string;
  name: string;
};

export type ProductCategoryWithProductsDto = ProductCategoryDto & {
  products: ProductDto[];
};
