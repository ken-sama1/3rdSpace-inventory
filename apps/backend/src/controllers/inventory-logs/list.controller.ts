import {
  type GetInventoryLogsReqQueryInput,
  getInventoryLogsReqQuerySchema,
  type GetInventoryLogsResBody,
  validateSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryLogsService } from "../../services/inventory-logs/index.js";

export const list = async (
  req: Request<{}, GetInventoryLogsResBody, {}, GetInventoryLogsReqQueryInput>,
  res: Response<GetInventoryLogsResBody>
) => {
  const query = validateSchema(getInventoryLogsReqQuerySchema, req.query);
  const result = await inventoryLogsService.list(query.filter, query.options);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
