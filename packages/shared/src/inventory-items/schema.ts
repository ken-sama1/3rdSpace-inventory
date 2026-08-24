import z from "zod";
import type { ResponseBody } from "../Response.js";
import type { InventoryItemDto } from "./types.js";
import type { DateMetaData } from "../common/types.js";
import { stringNullableSchema } from "../common/schema.js";

export const inventoryItemUnitSchema = z.enum(["G", "ML", "MG", "KG", "PCS"]);
export type InventoryItemUnit = z.infer<typeof inventoryItemUnitSchema>;

// --- Create ---
export const createInventoryItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: stringNullableSchema,
  quantity: z.union([z.number(), z.coerce.number()]).default(0),
  unit: inventoryItemUnitSchema.default("G"),
  imageUrl: stringNullableSchema,
  categoryId: stringNullableSchema,
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
export type GetInventoryItemsResult = InventoryItemDto[];
export type GetInventoryItemsResBody = ResponseBody<GetInventoryItemsResult>;

// --- Get By Id ---
export type GetInventoryItemResult = InventoryItemDto & DateMetaData;
export type GetInventoryItemResBody = ResponseBody<GetInventoryItemResult>;

// --- Stock In ---
export const stockInInventoryItemSchema = z.object({
  quantity: z.union([z.number(), z.coerce.number()]),
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
