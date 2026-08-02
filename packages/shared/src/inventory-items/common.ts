import z from "zod";

export const inventoryItemUnit = z.enum(["G", "ML", "KG"]);

export type InventoryItemUnit = z.infer<typeof inventoryItemUnit>;

export type InventoryItemDto = {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit: InventoryItemUnit;
  imageUrl: string | null;
};
