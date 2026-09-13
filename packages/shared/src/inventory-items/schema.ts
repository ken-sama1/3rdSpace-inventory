import z from "zod";
import {
  idSchema,
  idNullableSchema,
  stringNullableSchema,
} from "../common/schema.js";
import type { DateMetaData } from "../common/types.js";
import type { ResponseBody } from "../Response.js";
import type { InventoryItemDto } from "./types.js";
import {
  isoDateFilterSchema,
  numberFilterSchema,
} from "../common/filter-schema.js";
import { sortOrderSchema } from "../common/options-schema.js";

export const inventoryItemUnitSchema = z.enum(["G", "ML", "MG", "KG", "PCS"]);
export type InventoryItemUnitSchema = z.infer<typeof inventoryItemUnitSchema>;

export const inventoryItemSortBySchema = z.enum([
  "name",
  "unit",
  "quantity",
  "category",
]);
export type InventoryItemSortBySchema = z.infer<
  typeof inventoryItemSortBySchema
>;

// --- Options ---
export const inventoryItemOptionsSchema = z.object({
  sortBy: inventoryItemSortBySchema.optional(),
  order: sortOrderSchema.optional(),
  lastItemId: idSchema.optional(),
});
export type InventoryItemOptionsSchema = z.infer<
  typeof inventoryItemOptionsSchema
>;

// --- Filter ---
export const inventoryItemFilterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.array(idSchema).optional(),
  createdAt: isoDateFilterSchema.optional(),
  quantity: numberFilterSchema.optional(),
  unit: z.array(inventoryItemUnitSchema).optional(),
});

export type InventoryItemFilterSchema = z.infer<
  typeof inventoryItemFilterSchema
>;
export type InventoryItemFilterInput = z.input<
  typeof inventoryItemFilterSchema
>;

// --- Create ---
export const createInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: stringNullableSchema,
  quantity: z.union([z.number(), z.coerce.number()]).default(0),
  unit: inventoryItemUnitSchema.default("G"),
  imageUrl: stringNullableSchema,
  categoryId: idNullableSchema,
});
export type CreateInventoryItemInput = z.input<
  typeof createInventoryItemSchema
>;
export type CreateInventoryItemSchema = z.output<
  typeof createInventoryItemSchema
>;
export type CreateInventoryItemResult = InventoryItemDto;
export type CreateInventoryItemResBody =
  ResponseBody<CreateInventoryItemResult>;

// --- Update ---
export const updateInventoryItemSchema = createInventoryItemSchema
  .omit({ quantity: true })
  .partial();
export type UpdateInventoryItemInput = z.input<
  typeof updateInventoryItemSchema
>;
export type UpdateInventoryItemSchema = z.output<
  typeof updateInventoryItemSchema
>;
export type UpdateInventoryResult = InventoryItemDto;
export type UpdateInventoryResBody = ResponseBody<InventoryItemDto>;

// --- Delete ---
export type DeleteInventoryResult = InventoryItemDto & DateMetaData;
export type DeleteInventoryItemResBody = ResponseBody<DeleteInventoryResult>;

// --- Get ---
export const getInventoryItemsReqQuerySchema = z.object({
  filter: inventoryItemFilterSchema.optional(),
  options: inventoryItemOptionsSchema.optional(),
});

export type GetInventoryItemsResult = InventoryItemDto[];
export type GetInventoryItemsResBody = ResponseBody<GetInventoryItemsResult>;
export type GetInventoryItemsReqQuery = z.infer<
  typeof getInventoryItemsReqQuerySchema
>;

// --- Get By Id ---
export type GetInventoryItemByIdResult = InventoryItemDto & DateMetaData;
export type GetInventoryItemByIdResBody =
  ResponseBody<GetInventoryItemByIdResult>;

// --- Stock In ---
export const stockInInventoryItemSchema = z.object({
  quantity: z.coerce.number(),
});
export type StockInInventoryItemSchema = z.infer<
  typeof stockInInventoryItemSchema
>;
export type StockInInventoryItemInput = z.input<
  typeof stockInInventoryItemSchema
>;
export type StockInInventoryItemResult = InventoryItemDto;
export type StockInInventoryItemResBody =
  ResponseBody<StockInInventoryItemResult>;

// --- Stock Out ---
export const stockOutInventoryItemSchema = z.object({
  ...stockInInventoryItemSchema.shape,
  reason: z.string(),
});
export type StockOutInventoryItemSchema = z.infer<
  typeof stockOutInventoryItemSchema
>;
export type StockOutInventoryItemInput = z.input<
  typeof stockOutInventoryItemSchema
>;
export type StockOutInventoryItemResult = InventoryItemDto;
export type StockOutInventoryItemResBody =
  ResponseBody<StockOutInventoryItemResult>;
