import { loginSchema, registerSchema } from "@repo/shared";
import express, { type Router } from "express";
import { IS_IN_PROD } from "../constants.js";
import { authController } from "../controllers/auth/index.js";
import { validateReqBody } from "../middleware/validate-schema.middleware.js";

export const authRouter: Router = express.Router();

// Register
if (!IS_IN_PROD)
  authRouter.post(
    "/register",
    validateReqBody(registerSchema),
    authController.register
  );

// Login
authRouter.post("/login", validateReqBody(loginSchema), authController.login);

// Logout
authRouter.post("/logout", authController.logout);

// Refresh
authRouter.post("/refresh", authController.refresh);
