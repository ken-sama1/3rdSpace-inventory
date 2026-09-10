import type {
  IdParamSchema,
  UnassignProductsFromCategoryResBody,
  UnassignProductsFromCategorySchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const unassignProducts = async (
  req: Request<
    IdParamSchema,
    UnassignProductsFromCategoryResBody,
    UnassignProductsFromCategorySchema
  >,
  res: Response<UnassignProductsFromCategoryResBody>
) => {
  const result = await productCategoriesService.unassignProducts(
    req.params.id,
    req.body
  );

  res.status(200).json({
    message: "Category successfully updated",
    data: result,
  });
};
