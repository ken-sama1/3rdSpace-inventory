import {
  changePasswordSchema,
  idParamSchema,
  resetPasswordSchema,
  updateMeSchema,
  updateUserSchema,
} from "@repo/shared";
import express, { type Router } from "express";
import { usersController } from "../controllers/users/index.js";
import { requireRole } from "../middleware/require-role.middleware.js";
import {
  validateReqBody,
  validateReqParams,
} from "../middleware/validate-schema.middleware.js";

export const usersRouter: Router = express.Router();

usersRouter
  .route("/me")
  .get(usersController.getMe)
  .patch(validateReqBody(updateMeSchema), usersController.updateMe);

usersRouter.post(
  "/me/password",
  validateReqBody(changePasswordSchema),
  usersController.changePassword
);

usersRouter
  .route("/:id")
  .all(requireRole("ADMIN"))
  .delete(validateReqParams(idParamSchema), usersController.delete)
  .patch(
    validateReqParams(idParamSchema),
    validateReqBody(updateUserSchema),
    usersController.update
  );

usersRouter.post(
  "/:id/password",
  requireRole("ADMIN"),
  validateReqBody(resetPasswordSchema),
  validateReqParams(idParamSchema),
  usersController.resetPassword
);

usersRouter.get("/", requireRole("ADMIN"), usersController.list);
