import z from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export type ObjectIdSchema = z.infer<typeof objectIdSchema>;

export const objectIdNullableSchema = z
  .union([objectIdSchema, z.null()])
  .default(null);

// --- Generic Id Schema ---
// So when I transfer database can easily change the types
export const idSchema = objectIdSchema;

export type IdSchema = z.infer<typeof idSchema>;

export const idNullableSchema = objectIdNullableSchema;

// --- Params ---
export const idParamSchema = z.object({
  id: idSchema,
});

export type IdParam = z.infer<typeof idParamSchema>;

// --- String ---
export const stringNullableSchema = z
  .union([z.string(), z.null()])
  .default(null);

// --- Date ---
export const isoDateSchema = z.union([z.iso.date(), z.iso.datetime()]);
export type IsoDateSchema = z.infer<typeof isoDateSchema>;
