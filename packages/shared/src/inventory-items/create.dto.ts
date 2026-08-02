import z from "zod";
import { inventoryItemUnit, type InventoryItemDto } from "./common.js";
import type { ResponseBody } from "../Response.js";

export const createInventoryItemSchema = z.object({
  name: z.string(),
  description: z.union([z.string(), z.null()]).default(null),
  quantity: z.coerce.number().optional().default(0),
  unit: inventoryItemUnit.default("G"),
  imageUrl: z.union([z.string(), z.null()]).default(null),
});

export type CreateInventoryItemSchema = z.infer<
  typeof createInventoryItemSchema
>;

export type CreateInventoryItemResult = InventoryItemDto;

export type CreateInventoryItemResBody =
  ResponseBody<CreateInventoryItemResult>;
