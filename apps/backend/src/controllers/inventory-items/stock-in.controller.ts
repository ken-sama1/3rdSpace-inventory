import type {
  IdParam,
  StockInInventoryItemResBody,
  StockInInventoryItemSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const stockIn = async (
  req: Request<
    IdParam,
    StockInInventoryItemResBody,
    StockInInventoryItemSchema
  >,
  res: Response<StockInInventoryItemResBody>
): Promise<void> => {
  const result = await inventoryItemsService.stockIn(req.params.id, req.body);

  res.status(200).json({
    message: "Stock updated successfully",
    data: result,
  });
};
