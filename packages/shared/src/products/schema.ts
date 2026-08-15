import z from "zod";
import { stringNullableSchema } from "../common/schema.js";
import { inventoryItemUnitSchema } from "../inventory-items/schema.js";
import type { ProductDto, ProductWithInventoryItemsDto } from "./types.js";
import type { ResponseBody } from "../Response.js";
import type { InventoryItemDto } from "../inventory-items/types.js";

// --- Recipe Item ---
export const recipeItemSchema = z.object({
  inventoryItemId: z.string().min(1, "Inventory Item is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  unit: inventoryItemUnitSchema,
});

export type RecipeItemSchema = z.infer<typeof recipeItemSchema>;

// --- Create ---
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: stringNullableSchema,
  imageUrl: stringNullableSchema,
  category: stringNullableSchema,
  price: z.coerce.number().nonnegative(),
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
export type GetProductsByIdResBody = ResponseBody<GetProductByIdResult>;

// --- Update ---
export const updateProductSchema = z
  .object({
    ...createProductSchema.shape,
  })
  .partial();

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type UpdateProductResult = ProductWithInventoryItemsDto;
export type UpdateProductResBody = ResponseBody<UpdateProductResult>;

// --- Delete ---
export type DeleteProductResult = ProductDto;
export type DeleteProductResBody = ResponseBody<DeleteProductResult>;

// --- Deduct Stock for Product ---
export const deductStockForProductSchema = z.object({
  quantity: z.coerce.number(),
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
