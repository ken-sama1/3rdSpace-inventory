import express, { type Router } from "express";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";
import {
  createInventoryItemCategorySchema,
  idParamSchema,
  updateInventoryItemCategorySchema,
} from "@repo/shared";
import { inventoryItemCategoriesController } from "../controllers/inventory-item-categories/index.js";

export const inventoryItemCategoriesRouter: Router = express.Router();

inventoryItemCategoriesRouter.post(
  "/create",
  validateReqBody(createInventoryItemCategorySchema),
  inventoryItemCategoriesController.create
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
