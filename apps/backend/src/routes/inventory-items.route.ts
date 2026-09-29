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
import { requireRole } from "../middleware/require-role.middleware.js";

const inventoryItemsRouter: Router = express.Router();

inventoryItemsRouter.get("/", inventoryItemsController.list);

inventoryItemsRouter.post(
  "/create",
  // requireRole("ADMIN", "MANAGER"),
  validateReqBody(createInventoryItemSchema),
  inventoryItemsController.create
);

inventoryItemsRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .patch(
    // requireRole("ADMIN", "MANAGER"),
    validateReqBody(updateInventoryItemSchema),
    inventoryItemsController.update
  )
  .delete(requireRole("ADMIN", "MANAGER"), inventoryItemsController.delete)
  .get(inventoryItemsController.getById);

inventoryItemsRouter.post(
  "/:id/stock-in",
  // requireRole("ADMIN", "MANAGER"),
  validateReqParams(idParamSchema),
  inventoryItemsController.stockIn
);

inventoryItemsRouter.post(
  "/:id/stock-out",
  // requireRole("ADMIN", "MANAGER"),
  inventoryItemsController.stockOut
);

export { inventoryItemsRouter };
