import type { Request, Response } from "express";
import { usersService } from "../../services/users/index.js";
import type { DeleteUserResBody, IdParamSchema } from "@repo/shared";

export const remove = async (
  req: Request<IdParamSchema>,
  res: Response<DeleteUserResBody>
): Promise<void> => {
  const result = await usersService.delete(req.params.id, req.auth.userId);

  res.status(200).json({
    message: "User successfully deleted",
    data: result,
  });
};
