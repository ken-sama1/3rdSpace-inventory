import z from "zod";
import { inventoryItemUnit, type InventoryItemDto } from "./common.js";
import type { ResponseBody } from "../Response.js";

export const updateInventoryItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit: inventoryItemUnit.optional(),
  imageUrl: z.string().optional(),
});

export type UpdateInventoryItemSchema = z.infer<
  typeof updateInventoryItemSchema
>;

export type UpdateInventoryResult = InventoryItemDto;

export type UpdateInventoryResBody = ResponseBody<InventoryItemDto>;
