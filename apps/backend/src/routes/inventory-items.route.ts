import {
  createInventoryItemSchema,
  idParamSchema,
  updateInventoryItemSchema,
} from "@repo/shared";
import express, { Router } from "express";
import { inventoryItemsController } from "../controllers/inventory-items/index.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";

const inventoryItemsRouter: Router = express.Router();

inventoryItemsRouter.get("/", inventoryItemsController.list);

inventoryItemsRouter.post(
  "/create",
  validateReqBody(createInventoryItemSchema),
  inventoryItemsController.create
);

inventoryItemsRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .patch(
    validateReqBody(updateInventoryItemSchema),
    inventoryItemsController.update
  )
  .delete(inventoryItemsController.delete)
  .get(inventoryItemsController.getById);

inventoryItemsRouter.post(
  "/:id/stock-in",
  validateReqParams(idParamSchema),
  inventoryItemsController.stockIn
);

inventoryItemsRouter.post("/:id/stock-out", inventoryItemsController.stockOut);

export { inventoryItemsRouter };
