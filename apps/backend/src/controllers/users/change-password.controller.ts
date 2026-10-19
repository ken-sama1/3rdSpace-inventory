import type { ChangePasswordSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { usersService } from "../../services/users/index.js";

export const changePassword = async (
  req: Request<object, unknown, ChangePasswordSchema>,
  res: Response
) => {
  await usersService.changePassword(req.auth.userId, req.body);

  res.sendStatus(204);
};
