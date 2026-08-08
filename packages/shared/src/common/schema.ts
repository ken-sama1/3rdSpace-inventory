import z from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// --- Params ---
export const idParamSchema = z.object({
  id: objectIdSchema,
});

export type IdParam = z.infer<typeof idParamSchema>;

// --- Union ---
export const stringNullableSchema = z
  .union([z.string(), z.null()])
  .default(null);
