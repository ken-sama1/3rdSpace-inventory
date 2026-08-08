import type { Request, Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";
import type { GetInventoryItemsResBody } from "@repo/shared";

export const list = async (
  _: Request,
  res: Response<GetInventoryItemsResBody>
): Promise<void> => {
  const result = await inventoryItemsService.list();

  res.status(200).json({
    message: "success",
    data: result,
  });
};
