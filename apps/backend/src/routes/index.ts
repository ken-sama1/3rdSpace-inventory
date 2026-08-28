import express, { type Router } from "express";
import { inventoryItemsRouter } from "./inventory-items.route.js";
import { productsRouter } from "./products.route.js";

const apiV1Router: Router = express.Router();

apiV1Router.use("/inventory-items", inventoryItemsRouter);
apiV1Router.use("/products", productsRouter);
apiV1Router.use("/inventory-item-categories", inventoryItemsRouter);

export { apiV1Router };
