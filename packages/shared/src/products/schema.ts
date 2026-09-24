import z from "zod";
import type { ResponseBody } from "../Response.js";
import { numberFilterSchema } from "../common/filter-schema.js";
import { sortOrderSchema } from "../common/options-schema.js";
import {
  idNullableSchema,
  idSchema,
  stringNullableSchema,
} from "../common/schema.js";
import type { DateMetaData } from "../common/types.js";
import type { InventoryItemDto } from "../inventory-items/types.js";
import type { ProductDto, ProductWithInventoryItemsDto } from "./types.js";

export const productSortBySchema = z.enum(["category", "name", "price"]);
export type ProductSortBySchema = z.infer<typeof productSortBySchema>;

// --- Filter ---
export const productFilterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.array(idSchema).optional(),
  price: numberFilterSchema.optional(),
});
export type ProductFilterInput = z.input<typeof productFilterSchema>;
export type ProductFilterSchema = z.infer<typeof productFilterSchema>;

// --- Options ---
export const productOptionsSchema = z.object({
  sortBy: productSortBySchema.optional(),
  order: sortOrderSchema.optional(),
  lastProductId: idSchema.optional(),
});
export type ProductOptionsSchema = z.infer<typeof productOptionsSchema>;
export type ProductOptionsInput = z.infer<typeof productOptionsSchema>;

// --- Recipe Item ---
export const recipeItemSchema = z.object({
  inventoryItemId: idSchema,
  quantity: z.coerce.number(),
});
export type RecipeItemSchema = z.infer<typeof recipeItemSchema>;

// --- Create ---
export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: stringNullableSchema,
  imageUrl: stringNullableSchema,
  categoryId: idNullableSchema,
  price: z.coerce.number().nonnegative(),
  recipeItems: z
    .array(
      recipeItemSchema
        .omit({
          quantity: true,
        })
        .extend({
          quantity: recipeItemSchema.shape.quantity.min(
            1,
            "Quantity must not be less than one"
          ),
        })
    )
    .min(1, "Require at least one item for recipe"),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type CreateProductResult = ProductDto;
export type CreateProductResBody = ResponseBody<ProductDto>;

// --- Get Products ---
export const getProductsReqQuerySchema = z.object({
  filter: productFilterSchema.optional(),
  options: productOptionsSchema.optional(),
});
export type GetProductsResult = ProductWithInventoryItemsDto[];
export type GetProductsResBody = ResponseBody<GetProductsResult>;
export type GetProductsReqQuerySchema = z.infer<
  typeof getProductsReqQuerySchema
>;
export type GetProductsReqQueryInput = z.infer<
  typeof getProductsReqQuerySchema
>;

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
  quantity: z.coerce.number(),
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
