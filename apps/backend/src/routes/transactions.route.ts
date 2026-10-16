import express, { type Router } from "express";
import { transactionsController } from "../controllers/transactions/index.js";
import { requireRole } from "../middleware/require-role.middleware.js";

const transactionsRouter: Router = express.Router();

transactionsRouter.get(
  "/",
  requireRole("MANAGER", "ADMIN"),
  transactionsController.list
);
export { transactionsRouter };
