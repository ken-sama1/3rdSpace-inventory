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
import { requireRole } from "../middleware/require-role.middleware.js";

const productsRouter: Router = express.Router();

productsRouter.post(
  "/create",
  requireRole("ADMIN", "MANAGER"),
  validateReqBody(createProductSchema),
  productsController.create
);

productsRouter.post(
  "/:id/deduct-stock",
  requireRole("ADMIN", "MANAGER", "STAFF"),
  validateReqParams(idParamSchema),
  validateReqBody(deductStockForProductSchema),
  productsController.deductStockForProduct
);

productsRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .get(productsController.getById)
  .delete(requireRole("ADMIN", "MANAGER"), productsController.delete)
  .patch(requireRole("ADMIN", "MANAGER"), productsController.update);

productsRouter.get("/", productsController.list);

export { productsRouter };
