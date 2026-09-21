import express, { type Router } from "express";
import { usersController } from "../controllers/users/index.js";
import { validateReqBody } from "../middleware/validate-schema.middleware.js";
import { updateMeSchema } from "@repo/shared";

export const usersRouter: Router = express.Router();

usersRouter
  .route("/me")
  .get(usersController.getMe)
  .patch(validateReqBody(updateMeSchema), usersController.updateMe);
