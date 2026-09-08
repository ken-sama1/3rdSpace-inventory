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

export const inventoryItemCategoriesRouter: Router = express.Router();

inventoryItemCategoriesRouter.post(
  "/create",
  validateReqBody(createInventoryItemCategorySchema),
  inventoryItemCategoriesController.create
);

inventoryItemCategoriesRouter.post(
  "/:id/assign-items",
  validateReqParams(idParamSchema),
  validateReqBody(assignInventoryItemsToCategorySchema),
  inventoryItemCategoriesController.assignItems
);

inventoryItemCategoriesRouter.post(
  "/:id/unassign-items",
  validateReqParams(idParamSchema),
  validateReqBody(unassignInventoryItemsFromCategorySchema),
  inventoryItemCategoriesController.unassignItems
);

inventoryItemCategoriesRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .get(inventoryItemCategoriesController.getById)
  .patch(
    validateReqBody(updateInventoryItemCategorySchema),
    inventoryItemCategoriesController.update
  )
  .delete(inventoryItemCategoriesController.delete);

inventoryItemCategoriesRouter.get("/", inventoryItemCategoriesController.list);
