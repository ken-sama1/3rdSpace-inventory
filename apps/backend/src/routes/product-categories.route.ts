import {
  assignProductsToCategorySchema,
  createProductCategorySchema,
  idParamSchema,
  unassignProductsFromCategorySchema,
  updateProductCategorySchema,
} from "@repo/shared";
import express, { type Router } from "express";
import { productCategoriesController } from "../controllers/product-categories/index.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";

export const productCategoriesRouter: Router = express.Router();

productCategoriesRouter.post(
  "/create",
  validateReqBody(createProductCategorySchema),
  productCategoriesController.create
);

productCategoriesRouter.post(
  "/:id/assign-items",
  validateReqParams(idParamSchema),
  validateReqBody(assignProductsToCategorySchema),
  productCategoriesController.assignProducts
);

productCategoriesRouter.post(
  "/:id/unassign-items",
  validateReqParams(idParamSchema),
  validateReqBody(unassignProductsFromCategorySchema),
  productCategoriesController.unassignProducts
);

productCategoriesRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .patch(
    validateReqBody(updateProductCategorySchema),
    productCategoriesController.update
  )
  .delete(productCategoriesController.delete)
  .get(productCategoriesController.getById);

productCategoriesRouter.get("/", productCategoriesController.list);
