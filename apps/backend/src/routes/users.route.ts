import express, { type Router } from "express";
import { usersController } from "../controllers/users/index.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";
import { idParamSchema, updateMeSchema, updateUserSchema } from "@repo/shared";
import { requireRole } from "../middleware/require-role.middleware.js";

export const usersRouter: Router = express.Router();

usersRouter
  .route("/me")
  .get(usersController.getMe)
  .patch(validateReqBody(updateMeSchema), usersController.updateMe);

usersRouter
  .route("/:id")
  .all(requireRole("ADMIN"))
  .delete(
    requireRole("ADMIN"),
    validateReqParams(idParamSchema),
    usersController.delete
  )
  .patch(
    validateReqParams(idParamSchema),
    validateReqBody(updateUserSchema),
    usersController.update
  );

usersRouter.get("/", requireRole("ADMIN"), usersController.list);
