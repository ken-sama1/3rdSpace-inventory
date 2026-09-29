import {
  getReportSummaryReqQuerySchema,
  validateSchema,
  type GetReportSummaryReqQuerySchema,
  type GetReportSummaryResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { reportsService } from "../../services/reports/index.js";

export const getSummary = async (
  req: Request<{}, GetReportSummaryResBody, {}, GetReportSummaryReqQuerySchema>,
  res: Response<GetReportSummaryResBody>
): Promise<void> => {
  const query = validateSchema(getReportSummaryReqQuerySchema, req.query);
  const result = await reportsService.getSummary(query);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
