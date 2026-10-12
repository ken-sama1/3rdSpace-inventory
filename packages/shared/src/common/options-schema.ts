import z from "zod";

// --- Sort Order ---
export const sortOrderSchema = z.enum(["asc", "desc"]);

export type SortOrderSchema = z.infer<typeof sortOrderSchema>;

// --- Base Options ---
export const baseOptionsSchema = z
  .object({
    limit: z.number().min(1).max(100),
    order: sortOrderSchema,
  })
  .partial();
