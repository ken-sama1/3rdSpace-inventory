import z from "zod";
import type { ResponseBody } from "../Response.js";
import type { ReportSummaryDto } from "./types.js";

export const reportPeriodSchema = z.enum(["7d", "30d", "all"]).default("7d");
export type ReportPeriodSchema = z.infer<typeof reportPeriodSchema>;

export const reportFilterSchema = z.object({
  period: reportPeriodSchema.optional(),
});

export const getReportSummaryReqQuerySchema = z.object({
  filter: reportFilterSchema.optional(),
  //for now its just a placeholder
  options: z.any().optional(),
});
export type GetReportSummaryReqQuerySchema = z.infer<
  typeof getReportSummaryReqQuerySchema
>;
export type GetReportSummaryReqQueryInput = z.input<
  typeof getReportSummaryReqQuerySchema
>;
export type GetReportSummaryResult = ReportSummaryDto;
export type GetReportSummaryResBody = ResponseBody<GetReportSummaryResult>;
