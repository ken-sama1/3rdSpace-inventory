import type {
  DeductStockForProductResBody,
  DeductStockForProductSchema,
  IdParam,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const deductStockForProduct = async (
  req: Request<
    IdParam,
    DeductStockForProductResBody,
    DeductStockForProductSchema
  >,
  res: Response<DeductStockForProductResBody>
): Promise<void> => {
  const result = await productsService.deductStockForProduct(
    req.params.id,
    req.body
  );

  res.status(200).json({
    message: "Stock successfully deducted for production",
    data: result,
  });
};
