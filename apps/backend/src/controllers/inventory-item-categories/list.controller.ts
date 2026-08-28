import type { GetInventoryItemCategoriesResBody } from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";

export const list = async (
  _req: Request,
  res: Response<GetInventoryItemCategoriesResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.list();

  res.status(200).json({
    message: "success",
    data: result,
  });
};
