import type { IdParamSchema, ResetPasswordSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { usersService } from "../../services/users/index.js";

export const resetPassword = async (
  req: Request<IdParamSchema, any, ResetPasswordSchema>,
  res: Response
): Promise<void> => {
  await usersService.resetPassword(req.params.id, req.body);

  res.sendStatus(204);
};
