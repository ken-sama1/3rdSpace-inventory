import z from "zod";
import { stringNullableSchema } from "../common/schema.js";
import { inventoryItemUnitSchema } from "../inventory-items/schema.js";
import type { ProductDto } from "./types.js";
import type { ResponseBody } from "../Response.js";

export const recipeItemSchema = z.object({
  inventoryItemId: z.string().min(1, "Inventory Item is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  unit: inventoryItemUnitSchema,
});

export type RecipeItemSchema = z.infer<typeof recipeItemSchema>;

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
