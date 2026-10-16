import type {
  DeductStockResBody,
  DeductStockSchema,
  IdParamSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const deductStock = async (
  req: Request<IdParamSchema, DeductStockResBody, DeductStockSchema>,
  res: Response<DeductStockResBody>
): Promise<void> => {
  const result = await productsService.deductStock(req.params.id, req.body);

  res.status(200).json({
    message: "Stock successfully deducted for",
    data: result,
  });
};
