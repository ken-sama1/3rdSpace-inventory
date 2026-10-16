import {
  createProductSchema,
  deductStockSchema,
  deductStocksSchema,
  idParamSchema,
} from "@repo/shared";
import express, { type Router } from "express";
import { productsController } from "../controllers/products/index.js";
import { requireRole } from "../middleware/require-role.middleware.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";

const productsRouter: Router = express.Router();

productsRouter.post(
  "/create",
  requireRole("ADMIN", "MANAGER"),
  validateReqBody(createProductSchema),
  productsController.create
);

productsRouter.post(
  "/deduct-stocks",
  requireRole("ADMIN", "MANAGER", "STAFF"),
  validateReqBody(deductStocksSchema),
  productsController.deductStocks
);

productsRouter.post(
  "/:id/deduct-stock",
  requireRole("ADMIN", "MANAGER", "STAFF"),
  validateReqParams(idParamSchema),
  validateReqBody(deductStockSchema),
  productsController.deductStock
);

productsRouter
  .route("/:id")
  .all(validateReqParams(idParamSchema))
  .get(productsController.getById)
  .delete(requireRole("ADMIN", "MANAGER"), productsController.delete)
  .patch(requireRole("ADMIN", "MANAGER"), productsController.update);

productsRouter.get("/", productsController.list);

export { productsRouter };
