import type {
  IdParamSchema,
  StockOutInventoryItemResBody,
  StockOutInventoryItemSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const stockOut = async (
  req: Request<
    IdParamSchema,
    StockOutInventoryItemResBody,
    StockOutInventoryItemSchema
  >,
  res: Response<StockOutInventoryItemResBody>
): Promise<void> => {
  const result = await inventoryItemsService.stockOut(req.params.id, req.body);

  res.status(200).json({
    message: "Successfully deducted from the stock",
    data: result,
  });
};
