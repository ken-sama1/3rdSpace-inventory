import {
  getInventoryItemsReqQuerySchema,
  validateSchema,
  type GetInventoryItemsReqQuery,
  type GetInventoryItemsResBody,
} from "@repo/shared";
import { type Request, type Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const list = async (
  req: Request<{}, GetInventoryItemsResBody, {}, GetInventoryItemsReqQuery>,
  res: Response<GetInventoryItemsResBody>
): Promise<void> => {
  const query = validateSchema(getInventoryItemsReqQuerySchema, req.query);
  const result = await inventoryItemsService.list(query.filter, query.options);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
