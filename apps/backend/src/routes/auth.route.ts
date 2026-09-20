import { idParamSchema, loginSchema, registerSchema } from "@repo/shared";
import express, { type Router } from "express";
import { ENV } from "../config/constants.js";
import { authController } from "../controllers/auth/index.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";

export const authRouter: Router = express.Router();

// Register
if (ENV === "prod")
  authRouter.post(
    "/register",
    validateReqBody(registerSchema),
    authController.register
  );

// Login
authRouter.post("/login", validateReqBody(loginSchema), authController.login);

// Logout
authRouter.post(
  "/:id/logout",
  validateReqParams(idParamSchema),
  authController.logout
);

// Refresh
authRouter.post(
  "/:id/refresh",
  validateReqParams(idParamSchema),
  authController.refresh
);
