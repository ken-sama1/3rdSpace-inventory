import type {
  IdParamSchema,
  UpdateInventoryItemCategoryResBody,
  UpdateProductCategoryResBody,
  UpdateProductCategorySchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const update = async (
  req: Request<
    IdParamSchema,
    UpdateProductCategoryResBody,
    UpdateProductCategorySchema
  >,
  res: Response<UpdateInventoryItemCategoryResBody>
): Promise<void> => {
  const result = await productCategoriesService.update(req.params.id, req.body);

  res.status(200).json({
    message: "Product category updated successfully",
    data: result,
  });
};
