import {
  getInventoryItemCategoriesReqQuerySchema,
  validateSchema,
  type GetInventoryItemCategoriesReqQuerySchema,
  type GetInventoryItemCategoriesResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { inventoryItemCategoriesService } from "../../services/inventory-item-categories/index.js";

export const list = async (
  req: Request<
    {},
    GetInventoryItemCategoriesResBody,
    {},
    GetInventoryItemCategoriesReqQuerySchema
  >,
  res: Response<GetInventoryItemCategoriesResBody>
): Promise<void> => {
  const query = validateSchema(
    getInventoryItemCategoriesReqQuerySchema,
    req.query
  );

  const result = await inventoryItemCategoriesService.list(query);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
