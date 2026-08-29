import type { GetProductCategoriesResBody } from "@repo/shared";
import type { Request, Response } from "express";
import { productCategoriesService } from "../../services/product-categories/index.js";

export const list = async (
  _req: Request,
  res: Response<GetProductCategoriesResBody>
): Promise<void> => {
  const result = await productCategoriesService.list();

  res.status(200).json({
    message: "success",
    data: result,
  });
};
