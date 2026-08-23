import z from "zod";
import { inventoryItemUnitSchema } from "./schema.js";
import { isoDateFilterSchema, numberFilterSchema } from "../common/schema.js";

export const inventoryItemFilterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  category: z.array(z.string()).optional(),
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
