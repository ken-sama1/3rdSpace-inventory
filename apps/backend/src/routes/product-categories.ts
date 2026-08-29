import express, { type Router } from "express";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";
import {
  createProductCategorySchema,
  idParamSchema,
  updateProductCategorySchema,
} from "@repo/shared";
import { productCategoriesController } from "../controllers/product-categories/index.js";

export const productCategoriesRouter: Router = express.Router();

productCategoriesRouter.post(
  "/create",
  validateReqBody(createProductCategorySchema),
  productCategoriesController.create
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
