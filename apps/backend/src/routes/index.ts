import express, { type Router } from "express";
import { inventoryItemsRouter } from "./inventory-items.routes.js";

const apiV1Router: Router = express.Router();

apiV1Router.use("/inventory-items", inventoryItemsRouter);

export { apiV1Router };
