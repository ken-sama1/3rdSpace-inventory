import {
  assignInventoryItemsToCategorySchema,
  createInventoryItemCategorySchema,
  idParamSchema,
  unassignInventoryItemsFromCategorySchema,
  updateInventoryItemCategorySchema,
} from "@repo/shared";
import express, { type Router } from "express";
import { inventoryItemCategoriesController } from "../controllers/inventory-item-categories/index.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";
import { requireRole } from "../middleware/require-role.middleware.js";

export const inventoryItemCategoriesRouter: Router = express.Router();

inventoryItemCategoriesRouter.post(
  "/create",
  requireRole("ADMIN", "MANAGER"),
  validateReqBody(createInventoryItemCategorySchema),
  inventoryItemCategoriesController.create
);

inventoryItemCategoriesRouter.post(
  "/:id/assign-items",
  requireRole("ADMIN", "MANAGER"),
  validateReqParams(idParamSchema),
  validateReqBody(assignInventoryItemsToCategorySchema),
  inventoryItemCategoriesController.assignItems
);

inventoryItemCategoriesRouter.post(
  "/:id/unassign-items",
  requireRole("ADMIN", "MANAGER"),
  validateReqParams(idParamSchema),
  validateReqBody(unassignInventoryItemsFromCategorySchema),
  inventoryItemCategoriesController.unassignItems
);

inventoryItemCategoriesRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .get(inventoryItemCategoriesController.getById)
  .patch(
    requireRole("ADMIN", "MANAGER"),
    validateReqBody(updateInventoryItemCategorySchema),
    inventoryItemCategoriesController.update
  )
  .delete(
    requireRole("ADMIN", "MANAGER"),
    inventoryItemCategoriesController.delete
  );

inventoryItemCategoriesRouter.get("/", inventoryItemCategoriesController.list);
