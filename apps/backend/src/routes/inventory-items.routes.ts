import express, { Router } from "express";
import { inventoryItemsController } from "../controllers/inventory-items/index.js";

const inventoryItemsRouter: Router = express.Router();

inventoryItemsRouter.post("/create", inventoryItemsController.create);

export { inventoryItemsRouter };
