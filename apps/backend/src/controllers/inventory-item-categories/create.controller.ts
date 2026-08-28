import type {
  CreateInventoryItemCategoryResBody,
  CreateInventoryItemCategorySchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";

export const create = async (
  req: Request<
    {},
    CreateInventoryItemCategoryResBody,
    CreateInventoryItemCategorySchema
  >,
  res: Response<CreateInventoryItemCategoryResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.create(req.body);

  res.status(201).json({
    message: "Category successfully created",
    data: result,
  });
};
