import type {
  GetProductCategoryByIdResBody,
  IdParamSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const getById = async (
  req: Request<IdParamSchema>,
  res: Response<GetProductCategoryByIdResBody>
): Promise<void> => {
  const result = await productCategoriesService.getById(req.params.id);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
