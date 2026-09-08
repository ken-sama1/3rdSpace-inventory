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

  const count = result.length;

  res.status(200).json({
    message: `Successfully removed ${count} ${count > 1 ? "items" : "item"} from category`,
    data: result,
  });
};
