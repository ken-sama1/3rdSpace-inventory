import type { DeleteInventoryItemResBody, IdParamSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const remove = async (
  req: Request<IdParamSchema>,
  res: Response<DeleteInventoryItemResBody>
): Promise<void> => {
  const result = await inventoryItemsService.delete(req.params.id);

  res.status(200).json({
    message: "Item successfully deleted",
    data: {
      ...result,
    },
  });
};
