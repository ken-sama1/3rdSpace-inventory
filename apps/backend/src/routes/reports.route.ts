import express, { type Router } from "express";
import { reportsController } from "../controllers/reports/index.js";
import { requireRole } from "../middleware/require-role.middleware.js";

const reportsRouter: Router = express.Router();

reportsRouter.get(
  "/",
  requireRole("ADMIN", "MANAGER"),
  reportsController.getSummary
);

export { reportsRouter };
