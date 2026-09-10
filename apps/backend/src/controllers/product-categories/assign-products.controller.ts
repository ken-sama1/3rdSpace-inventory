import type {
  AssignProductsToCategoryResBody,
  AssignProductsToCategorySchema,
  IdParamSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const assignProducts = async (
  req: Request<
    IdParamSchema,
    AssignProductsToCategoryResBody,
    AssignProductsToCategorySchema
  >,
  res: Response<AssignProductsToCategoryResBody>
): Promise<void> => {
  const result = await productCategoriesService.assignProducts(
    req.params.id,
    req.body
  );

  res.status(200).json({
    message: "Category successfully updated",
    data: result,
  });
};
