import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";
import type {
  GetInventoryItemCategoryByIdResBody,
  IdParamSchema,
} from "@repo/shared";

export const getById = async (
  req: Request<IdParamSchema>,
  res: Response<GetInventoryItemCategoryByIdResBody>
): Promise<void> => {
  const result = await inventoryItemCategoriesService.getById(req.params.id);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
