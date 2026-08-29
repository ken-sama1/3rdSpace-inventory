import type { IdSchema } from "../common/schema.js";
import type { ProductDto } from "../products/types.js";

export type ProductCategoryDto = {
  id: IdSchema;
  name: string;
};

export type ProductCategoryWithProductsDto = ProductCategoryDto & {
  products: Omit<ProductDto, "category">[];
};
