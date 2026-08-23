import {
  productFilterSchema,
  validateSchema,
  type GetProductsResBody,
  type ProductFilterInput,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const list = async (
  req: Request<{}, GetProductsResBody, {}, ProductFilterInput>,
  res: Response<GetProductsResBody>
): Promise<void> => {
  const filter = validateSchema(productFilterSchema, req.query);
  const result = await productsService.list(filter);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
