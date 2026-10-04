import express, { type Router } from "express";
import { authRouter } from "./auth.route.js";
import { inventoryItemCategoriesRouter } from "./inventory-item-categories.route.js";
import { inventoryItemsRouter } from "./inventory-items.route.js";
import { productCategoriesRouter } from "./product-categories.route.js";
import { productsRouter } from "./products.route.js";
import { reportsRouter } from "./reports.route.js";
import { usersRouter } from "./users.route.js";
import { authJwt } from "../middleware/auth-jwt.middleware.js";

const apiV1Router: Router = express.Router();

apiV1Router.use("/auth", authRouter);

apiV1Router.use(authJwt);
apiV1Router.use("/users", usersRouter);
apiV1Router.use("/inventory-items", inventoryItemsRouter);
apiV1Router.use("/products", productsRouter);
apiV1Router.use("/inventory-item-categories", inventoryItemCategoriesRouter);
apiV1Router.use("/product-categories", productCategoriesRouter);
apiV1Router.use("/reports", reportsRouter);

export { apiV1Router };
