import z from "zod";
import type {
  InventoryItemCategoryDto,
  InventoryItemCategoryWithItemsDto,
} from "./types.js";
import type { ResponseBody } from "../Response.js";
import type { DateMetaData } from "../common/types.js";

// --- Create ---
export const createInventoryItemCategorySchema = z.object({
  name: z.string(),
});
export type CreateInventoryItemCategoryInput = z.input<
  typeof createInventoryItemCategorySchema
>;
export type CreateInventoryItemCategorySchema = z.infer<
  typeof createInventoryItemCategorySchema
>;
export type CreateInventoryItemCategoryResult = InventoryItemCategoryDto;
export type CreateInventoryItemCategoryResBody =
  ResponseBody<CreateInventoryItemCategoryResult>;

// --- Get ---
export type GetInventoryItemCategoriesResult =
  InventoryItemCategoryWithItemsDto[];
export type GetInventoryItemCategoriesResBody =
  ResponseBody<GetInventoryItemCategoriesResult>;

// --- Get By Id ---
export type GetInventoryItemCategoryByIdResult =
  InventoryItemCategoryWithItemsDto;
export type GetInventoryItemCategoryByIdResBody =
  ResponseBody<GetInventoryItemCategoryByIdResult>;

// --- Update ---
export const updateInventoryItemCategorySchema =
  createInventoryItemCategorySchema.partial();
export type UpdateInventoryItemCategorySchema = z.infer<
  typeof updateInventoryItemCategorySchema
>;
export type UpdateInventoryItemCategoryInput = z.input<
  typeof updateInventoryItemCategorySchema
>;
export type UpdateInventoryItemCategoryResult = InventoryItemCategoryDto;
export type UpdateInventoryItemCategoryResBody =
  ResponseBody<UpdateInventoryItemCategoryResult>;

//--- Delete ---
export type DeleteInventoryItemCategoryResult = InventoryItemCategoryDto &
  DateMetaData;
export type DeleteInventoryItemCategoryResBody =
  ResponseBody<DeleteInventoryItemCategoryResult>;
