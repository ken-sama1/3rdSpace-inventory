import {
  inventoryItemFilterSchema,
  validateSchema,
  type GetInventoryItemsResBody,
  type InventoryItemFilterInput,
} from "@repo/shared";
import { type Request, type Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const list = async (
  req: Request<{}, GetInventoryItemsResBody, {}, InventoryItemFilterInput>,
  res: Response<GetInventoryItemsResBody>
): Promise<void> => {
  const filter = validateSchema(inventoryItemFilterSchema, req.query);
  const result = await inventoryItemsService.list(filter);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
