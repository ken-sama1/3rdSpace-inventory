import type {
  IdParam,
  UpdateInventoryItemCategoryResBody,
  UpdateInventoryItemCategorySchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";

export const update = async (
  req: Request<
    IdParam,
    UpdateInventoryItemCategoryResBody,
    UpdateInventoryItemCategorySchema
  >,
  res: Response<UpdateInventoryItemCategoryResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.update(
    req.params.id,
    req.body
  );

  res.status(200).json({
    message: "Item category successfully updated",
    data: result,
  });
};
