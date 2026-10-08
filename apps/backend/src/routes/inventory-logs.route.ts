import express, { type Router } from "express";
import { inventoryLogsController } from "../controllers/inventory-logs/index.js";

const inventoryLogsRouter: Router = express.Router();

inventoryLogsRouter.get("/", inventoryLogsController.list);

export { inventoryLogsRouter };
