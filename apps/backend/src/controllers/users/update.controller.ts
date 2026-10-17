import type {
  IdParamSchema,
  UpdateUserResBody,
  UpdateUserSchema,
} from "@repo/shared";
import type { Request, Response } from "express";
import { usersService } from "../../services/users/index.js";

export const update = async (
  req: Request<IdParamSchema, UpdateUserResBody, UpdateUserSchema>,
  res: Response<UpdateUserResBody>
): Promise<void> => {
  const result = await usersService.update(req.params.id, req.body);

  res.status(200).json({
    message: "User successfully updated",
    data: result,
  });
};
