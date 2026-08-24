import z from "zod";
import { isoDateFilterSchema, numberFilterSchema } from "../common/schema.js";

export const productFilterSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.array(z.string()).optional(),
  price: numberFilterSchema.optional(),
  createdAt: isoDateFilterSchema.optional(),
});

export type ProductFilterSchema = z.infer<typeof productFilterSchema>;
export type ProductFilterInput = z.input<typeof productFilterSchema>;
