import type {
  IdParamSchema,
  UnassignInventoryItemsFromCategoryResBody,
  UnassignInventoryItemsFromCategorySchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";

export const unassignItems = async (
  req: Request<
    IdParamSchema,
    UnassignInventoryItemsFromCategoryResBody,
    UnassignInventoryItemsFromCategorySchema
  >,
  res: Response<UnassignInventoryItemsFromCategoryResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.unassignItems(
    req.params.id,
    req.body
  );

  res.status(200).json({
    message: "Category successfully updated",
    data: result,
  });
};
