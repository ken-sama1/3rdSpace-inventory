import z from "zod";

// --- Sort Order ---
export const sortOrderSchema = z.enum(["asc", "desc"]);

export type SortOrderSchema = z.infer<typeof sortOrderSchema>;
