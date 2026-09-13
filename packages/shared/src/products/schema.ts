import z from "zod";
import type { ResponseBody } from "../Response.js";
import {
  idNullableSchema,
  idSchema,
  stringNullableSchema,
} from "../common/schema.js";
import type { DateMetaData } from "../common/types.js";
import type { InventoryItemDto } from "../inventory-items/types.js";
import type { ProductDto, ProductWithInventoryItemsDto } from "./types.js";

// --- Recipe Item ---
export const recipeItemSchema = z.object({
  inventoryItemId: idSchema,
  quantity: z.union([
    z.number(),
    z.coerce.number().positive("Quantity must be greater than zero"),
  ]),
});

export type RecipeItemSchema = z.infer<typeof recipeItemSchema>;

// --- Create ---
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: stringNullableSchema,
  imageUrl: stringNullableSchema,
  categoryId: idNullableSchema,
  price: z.union([z.number(), z.coerce.number().nonnegative()]),
  recipeItems: z.array(recipeItemSchema).default([]),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type CreateProductResult = ProductDto;
export type CreateProductResBody = ResponseBody<ProductDto>;

// --- Get Products ---
export type GetProductsResult = ProductWithInventoryItemsDto[];
export type GetProductsResBody = ResponseBody<GetProductsResult>;

// --- Get by Id ---
export type GetProductByIdResult = ProductWithInventoryItemsDto;
export type GetProductByIdResBody = ResponseBody<GetProductByIdResult>;

// --- Update ---
export const updateProductSchema = createProductSchema.partial();

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type UpdateProductResult = ProductWithInventoryItemsDto;
export type UpdateProductResBody = ResponseBody<UpdateProductResult>;

// --- Delete ---
export type DeleteProductResult = ProductDto & DateMetaData;
export type DeleteProductResBody = ResponseBody<DeleteProductResult>;

// --- Deduct Stock for Product ---
export const deductStockForProductSchema = z.object({
  quantity: z.union([z.number(), z.coerce.number()]),
  recipeItems: z.array(recipeItemSchema),
});

export type DeductStockForProductSchema = z.infer<
  typeof deductStockForProductSchema
>;
export type DeductStockForProductInput = z.input<
  typeof deductStockForProductSchema
>;
export type DeductStockForProductResult = InventoryItemDto[];
export type DeductStockForProductResBody =
  ResponseBody<DeductStockForProductResult>;
