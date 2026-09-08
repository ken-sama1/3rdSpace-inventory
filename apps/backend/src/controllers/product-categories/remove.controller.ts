import type { DeleteProductCategoryResBody, IdParamSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const remove = async (
  req: Request<IdParamSchema>,
  res: Response<DeleteProductCategoryResBody>
): Promise<void> => {
  const result = await productCategoriesService.delete(req.params.id);

  res.status(200).json({
    message: "Product category deleted successfully",
    data: result,
  });
};
