import z from "zod";
import type { ResponseBody } from "../Response.js";
import type { DateMetaData } from "../common/types.js";
import type {
  ProductCategoryDto,
  ProductCategoryWithProductsDto,
} from "./types.js";
import { idSchema } from "../common/schema.js";
import type { ProductDto } from "../products/types.js";

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
export type GetProductCategoryByIdResult = ProductCategoryWithProductsDto;
export type GetProductCategoryByIdResBody =
  ResponseBody<GetProductCategoryByIdResult>;

// --- Assign Products ---
export const assignProductsToCategorySchema = z.object({
  productIds: z.array(idSchema),
});
export type AssignProductsToCategorySchema = z.infer<
  typeof assignProductsToCategorySchema
>;
export type AssignProductsToCategoryInput = z.input<
  typeof assignProductsToCategorySchema
>;
export type AssignProductsToCategoryResult = ProductDto[];
export type AssignProductsToCategoryResBody =
  ResponseBody<AssignProductsToCategoryResult>;

// --- Unassign Products ---
export const unassignProductsFromCategorySchema =
  assignProductsToCategorySchema;
export type UnassignProductsFromCategorySchema = z.infer<
  typeof unassignProductsFromCategorySchema
>;
export type UnassignProductsFromCategoryInput = z.input<
  typeof unassignProductsFromCategorySchema
>;
export type UnassignProductsFromCategoryResult = ProductDto[];
export type UnassignProductsFromCategoryResBody =
  ResponseBody<UnassignProductsFromCategoryResult>;
