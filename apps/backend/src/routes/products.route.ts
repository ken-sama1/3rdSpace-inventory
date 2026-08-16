import express, { type Router } from "express";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";
import {
  createProductSchema,
  deductStockForProductSchema,
  idParamSchema,
} from "@repo/shared";
import { productsController } from "../controllers/products/index.js";

const productsRouter: Router = express.Router();

productsRouter.post(
  "/create",
  validateReqBody(createProductSchema),
  productsController.create
);

productsRouter.post(
  "/:id/deduct-stock",
  validateReqParams(idParamSchema),
  validateReqBody(deductStockForProductSchema),
  productsController.deductStockForProduct
);

productsRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .get(productsController.getById)
  .delete(productsController.delete)
  .patch(productsController.update);

productsRouter.get("/", productsController.list);

export { productsRouter };
