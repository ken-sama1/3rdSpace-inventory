import type { GetProductsResBody } from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const list = async (
  _req: Request,
  res: Response<GetProductsResBody>
): Promise<void> => {
  const result = await productsService.list();

  res.status(200).json({
    message: "success",
    data: result,
  });
};
