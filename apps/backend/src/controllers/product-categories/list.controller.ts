import {
  getProductCategoriesReqQuerySchema,
  validateSchema,
  type GetProductCategoriesReqQuerySchema,
  type GetProductCategoriesResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const list = async (
  req: Request<
    {},
    GetProductCategoriesResBody,
    {},
    GetProductCategoriesReqQuerySchema
  >,
  res: Response<GetProductCategoriesResBody>
): Promise<void> => {
  const query = validateSchema(getProductCategoriesReqQuerySchema, req.query);
  const result = await productCategoriesService.list(query);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
