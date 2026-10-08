import { loginSchema, registerSchema } from "@repo/shared";
import express, { type Router } from "express";
import { authController } from "../controllers/auth/index.js";
import { requireRole } from "../middleware/require-role.middleware.js";
import { validateReqBody } from "../middleware/validate-schema.middleware.js";

export const authRouter: Router = express.Router();

authRouter.post(
  "/register",
  requireRole("ADMIN"),
  validateReqBody(registerSchema),
  authController.register
);

// Login
authRouter.post("/login", validateReqBody(loginSchema), authController.login);

// Logout
authRouter.post("/logout", authController.logout);

// Refresh
authRouter.post("/refresh", authController.refresh);
