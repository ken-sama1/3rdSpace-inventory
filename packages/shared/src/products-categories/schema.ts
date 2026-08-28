import z from "zod";
import type {
  ProductCategoryDto,
  ProductCategoryWithProductsDto,
} from "./types.js";
import type { ResponseBody } from "../Response.js";
import type { DateMetaData } from "../common/types.js";
import type { ProductWithInventoryItemsDto } from "../products/types.js";

// --- Create ---
export const createProductCategorySchema = z.object({
  name: z.string(),
});
export type CreateProductCategorySchema = z.infer<
  typeof createProductCategorySchema
>;
export type CreateProductCategoryInput = z.input<
  typeof createProductCategorySchema
>;
export type CreateProductCategoryResult = ProductCategoryDto;
export type CreateProductCategoryResBody =
  ResponseBody<CreateProductCategoryResult>;

// --- Update ---
export const updateProductCategorySchema =
  createProductCategorySchema.partial();
export type UpdateProductCategorySchema = z.infer<
  typeof createProductCategorySchema
>;
export type UpdateProductCategoryInput = z.input<
  typeof createProductCategorySchema
>;
export type UpdateProductCategoryResult = ProductCategoryDto;
export type UpdateProductCategoryResBody =
  ResponseBody<UpdateProductCategoryResult>;

// --- Delete ---
export type DeleteProductCategoryResult = ProductCategoryDto & DateMetaData;
export type DeleteProductCategoryResBody =
  ResponseBody<DeleteProductCategoryResult>;

// --- Get Many ---
export type GetProductCategoriesResult = ProductCategoryWithProductsDto[];
export type GetProductCategoriesResBody =
  ResponseBody<GetProductCategoriesResult>;

// --- Get By Id ---
export type GetProductCategoryByIdResult = ProductWithInventoryItemsDto;
export type GetProductCategoryByIdResBody =
  ResponseBody<GetProductCategoryByIdResult>;
