import z from "zod";
import {
  isoDateFilterSchema,
  numberFilterSchema,
} from "../common/filter-schema.js";
import { baseOptionsSchema } from "../common/options-schema.js";
import { idSchema } from "../common/schema.js";
import type { TransactionDto } from "./types.js";
import type { ResponseBody } from "../Response.js";

export const transactionSortBySchema = z.enum(["createdAt", "totalPrice"]);
export type TransactionSortBySchema = z.infer<typeof transactionSortBySchema>;

// --- Transaction Filter ---
export const transactionFilterSchema = z
  .object({
    createdAt: isoDateFilterSchema,
    totalPrice: numberFilterSchema,
    id: idSchema,
  })
  .partial();
export type TransactionFilterSchema = z.infer<typeof transactionFilterSchema>;

// --- Transaction Options ---
export const transactionOptionsSchema = z
  .object({
    lastTransactionId: idSchema,
    sortBy: transactionSortBySchema,
  })
  .partial()
  .extend(baseOptionsSchema.shape);
export type TransactionOptionsSchema = z.infer<typeof transactionOptionsSchema>;

// --- Get Transactions ---
export const getTransactionsReqQuerySchema = z
  .object({
    filter: transactionFilterSchema,
    options: transactionOptionsSchema,
  })
  .partial();
export type GetTransactionsReqQuerySchema = z.infer<
  typeof getTransactionsReqQuerySchema
>;
export type GetTransactionsReqQueryInput = z.input<
  typeof getTransactionsReqQuerySchema
>;
export type GetTransactionsResult = TransactionDto[];
export type GetTransactionsResBody = ResponseBody<GetTransactionsResult>;
