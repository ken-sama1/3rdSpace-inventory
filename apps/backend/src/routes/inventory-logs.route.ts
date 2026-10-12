import express, { type Router } from "express";
import { inventoryLogsController } from "../controllers/inventory-logs/index.js";
import { requireRole } from "../middleware/require-role.middleware.js";

const inventoryLogsRouter: Router = express.Router();

inventoryLogsRouter.get(
  "/",
  requireRole("ADMIN", "MANAGER"),
  inventoryLogsController.list
);

export { inventoryLogsRouter };
