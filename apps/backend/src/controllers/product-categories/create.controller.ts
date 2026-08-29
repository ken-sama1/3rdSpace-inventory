import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";
import type {
  CreateInventoryItemCategoryResBody,
  CreateInventoryItemCategorySchema,
} from "@repo/shared";

export const create = async (
  req: Request<
    {},
    CreateInventoryItemCategoryResBody,
    CreateInventoryItemCategorySchema
  >,
  res: Response<CreateInventoryItemCategoryResBody>
): Promise<void> => {
  const result = await productCategoriesService.create(req.body);

  res.status(201).json({
    message: "Product category successfully created",
    data: result,
  });
};
