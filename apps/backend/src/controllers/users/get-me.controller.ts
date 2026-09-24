import type { GetMeResBody } from "@repo/shared";
import type { Request, Response } from "express";
import { usersService } from "../../services/users/index.js";

export const getMe = async (
  req: Request,
  res: Response<GetMeResBody>
): Promise<void> => {
  const result = await usersService.getById(req.auth.userId);

  res.status(200).json({
    data: result,
    message: "success",
  });
};
