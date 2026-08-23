import z from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// --- Params ---
export const idParamSchema = z.object({
  id: objectIdSchema,
});

export type IdParam = z.infer<typeof idParamSchema>;

// --- String ---
export const stringNullableSchema = z
  .union([z.string(), z.null()])
  .default(null);

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
export const isoDateSchema = z.union([z.iso.date(), z.iso.datetime()]);

export const isoDateFilterSchema = z.union([
  isoDateSchema,
  z.object({
    start: isoDateSchema.optional(),
    end: isoDateSchema.optional(),
  }),
]);

export type IsoDateFilterSchema = z.infer<typeof isoDateFilterSchema>;
