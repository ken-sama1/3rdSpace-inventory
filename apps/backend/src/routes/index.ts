import express, { type Router } from "express";
import { inventoryItemsRouter } from "./inventory-items.route.js";
import { productsRouter } from "./products.route.js";
import { inventoryItemCategoriesRouter } from "./inventory-item-categories.route.js";
import { productCategoriesRouter } from "./product-categories.js";

const apiV1Router: Router = express.Router();

apiV1Router.use("/inventory-items", inventoryItemsRouter);
apiV1Router.use("/products", productsRouter);
apiV1Router.use("/inventory-item-categories", inventoryItemCategoriesRouter);
apiV1Router.use("/product-categories", productCategoriesRouter);

export { apiV1Router };
