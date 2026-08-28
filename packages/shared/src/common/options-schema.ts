import z from "zod";

// --- Order ---
export const orderSchema = z.enum(["asc", "desc"]);

export type OrderSchema = z.infer<typeof orderSchema>;
