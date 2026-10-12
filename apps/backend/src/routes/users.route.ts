import express, { type Router } from "express";
import { usersController } from "../controllers/users/index.js";
import { validateReqBody } from "../middleware/validate-schema.middleware.js";
import { updateMeSchema } from "@repo/shared";
import { requireRole } from "../middleware/require-role.middleware.js";

export const usersRouter: Router = express.Router();

usersRouter
  .route("/me")
  .get(usersController.getMe)
  .patch(validateReqBody(updateMeSchema), usersController.updateMe);

usersRouter.get("/", requireRole("ADMIN"), usersController.list);
