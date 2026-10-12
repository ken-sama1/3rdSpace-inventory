import {
  getUsersReqQuerySchema,
  validateSchema,
  type GetUserReqQueryInput,
  type GetUsersResBody,
} from "@repo/shared";
import type { Request, Response } from "express";
import { usersService } from "../../services/users/index.js";

export const list = async (
  req: Request<{}, GetUsersResBody, {}, GetUserReqQueryInput>,
  res: Response<GetUsersResBody>
): Promise<void> => {
  const query = validateSchema(getUsersReqQuerySchema, req.query);

  const result = await usersService.list(query.filter, query.options);

  res.status(200).json({
    message: "success",
    data: result,
  });
};
