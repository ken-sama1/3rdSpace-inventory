import {
  type IdParam,
  type UpdateInventoryItemSchema,
  type UpdateInventoryResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const update = async (
  req: Request<IdParam, UpdateInventoryResBody, UpdateInventoryItemSchema>,
  res: Response<UpdateInventoryResBody>
): Promise<void> => {
  const result = await inventoryItemsService.update(req.params.id, req.body);

  res.status(200).json({
    message: "Item updated successfully",
    data: result,
  });
};
