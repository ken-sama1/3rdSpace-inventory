import type {
  CreateInventoryItemSchema,
  CreateInventoryItemResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemsService } from "../../services/inventory-items/index.js";

export const create = async (
  req: Request<{}, CreateInventoryItemResBody, CreateInventoryItemSchema>,
  res: Response<CreateInventoryItemResBody>
): Promise<void> => {
  const result = await inventoryItemsService.create(req.body);

  res.status(201).json({
    message: "Item successfully created",
    data: result,
  });
};
