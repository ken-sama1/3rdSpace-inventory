import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";
import type { DeleteInventoryItemCategoryResBody, IdParam } from "@repo/shared";

export const remove = async (
  req: Request<IdParam>,
  res: Response<DeleteInventoryItemCategoryResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.delete(req.params.id);

  res.status(200).json({
    message: "Item category successfully deleted",
    data: result,
  });
};
