import type { GetInventoryItemResBody, IdParam } from "@repo/shared";
import type { Response, Request } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const getById = async (
  req: Request<IdParam>,
  res: Response<GetInventoryItemResBody>
): Promise<void> => {
  const result = await inventoryItemsService.getById(req.params.id);

  res.status(200).json({
    data: result,
    message: "Item successfully retrieved",
  });
};
