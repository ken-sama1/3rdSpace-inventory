import z from "zod";
import { isoDateSchema } from "./schema.js";

// --- number ---
export const numberFilterSchema = z.union([
  z.coerce.number().optional(),
  z.object({
    gte: z.coerce.number().optional(),
    lte: z.coerce.number().optional(),
  }),
]);
export type NumberFilterSchema = z.infer<typeof numberFilterSchema>;

// --- Date ---
export const isoDateFilterSchema = z.union([
  isoDateSchema,
  z.object({
    start: isoDateSchema.optional(),
    end: isoDateSchema.optional(),
  }),
]);

export type IsoDateFilterSchema = z.infer<typeof isoDateFilterSchema>;
