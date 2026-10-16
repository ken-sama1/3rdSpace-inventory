import type { DeductStocksResBody, DeductStocksSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { productsService } from "../../services/products/index.js";

export const deductStocks = async (
  req: Request<object, DeductStocksResBody, DeductStocksSchema>,
  res: Response<DeductStocksResBody>
): Promise<void> => {
  const result = await productsService.deductStocks(req.body);

  res.status(200).json({
    message: "Stocks successfully deducted",
    data: result,
  });
};
