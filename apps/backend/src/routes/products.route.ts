import express, { type Router } from "express";
import { validateReqBody } from "../middleware/validate-schema.middleware.js";
import { createProductSchema } from "@repo/shared";
import { productsController } from "../controllers/products/index.js";

const productsRouter: Router = express.Router();

productsRouter.post(
  "/create",
  validateReqBody(createProductSchema),
  productsController.create
);

productsRouter.get("/", productsController.list);

export { productsRouter };
