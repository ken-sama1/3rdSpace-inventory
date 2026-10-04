import z from "zod";
import { isoDateFilterSchema } from "../common/filter-schema.js";
import { sortOrderSchema } from "../common/options-schema.js";
import { idSchema } from "../common/schema.js";
import type { ResponseBody } from "../Response.js";
import type { InventoryLogDto } from "./types.js";

export const inventoryLogSourceTypeSchema = z.enum([
  "ADJUSTMENT",
  "TRANSACTION",
]);
export type InventoryLogSourceTypeSchema = z.infer<
  typeof inventoryLogSourceTypeSchema
>;

// --- Filter ---
export const inventoryLogsFilterSchema = z
  .object({
    sourceId: idSchema,
    itemName: z.string(),
    reason: z.string(),
    createdAt: isoDateFilterSchema,
    inventoryItemId: z.string(),
  })
  .partial();
export type InventoryLogsFilterSchema = z.infer<
  typeof inventoryLogsFilterSchema
>;
export type InventoryLogsFilterInput = z.input<
  typeof inventoryLogsFilterSchema
>;

// --- Options ---
export const inventoryLogOptionsSchema = z
  .object({
    order: sortOrderSchema,
    // Placeholder for now
    sortBy: z.object(),
    lastInventoryLogId: idSchema,
  })
  .partial();
export type InventoryLogOptionsSchema = z.infer<
  typeof inventoryLogOptionsSchema
>;
export type InventoryLogOptionsInpit = z.input<
  typeof inventoryLogOptionsSchema
>;

// --- Get Inventory Logs ---
export const getInventoryLogsReqQuerySchema = z
  .object({
    filter: inventoryLogsFilterSchema,
    options: inventoryLogOptionsSchema,
  })
  .partial();
export type GetInventoryLogsReqQuerySchema = z.infer<
  typeof getInventoryLogsReqQuerySchema
>;
export type GetInventoryLogsReqQueryInput = z.input<
  typeof getInventoryLogsReqQuerySchema
>;
export type GetInventoryLogsResult = InventoryLogDto[];
export type GetInventorLogsResBody = ResponseBody<GetInventoryLogsResult>;
