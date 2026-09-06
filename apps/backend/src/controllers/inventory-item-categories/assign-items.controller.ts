import type {
  AssignInventoryItemsToCategoryResBody,
  AssignInventoryItemsToCategorySchema,
  IdParam,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";

export const assignItems = async (
  req: Request<
    IdParam,
    AssignInventoryItemsToCategoryResBody,
    AssignInventoryItemsToCategorySchema
  >,
  res: Response<AssignInventoryItemsToCategoryResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.assignItems(
    req.params.id,
    req.body
  );

  res.status(200).json({
    message: "Category successfully updated",
    data: result,
  });
};
