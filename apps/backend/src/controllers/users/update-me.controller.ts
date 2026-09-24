import type { UpdateMeResBody, UpdateMeSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { AppError } from "../../errors/AppError.js";
import { usersService } from "../../services/users/index.js";
import type { AuthCookies } from "../types/AuthCookies.js";

export const updateMe = async (
  req: Request<{}, UpdateMeResBody, UpdateMeSchema>,
  res: Response<UpdateMeResBody>
): Promise<void> => {
  const { refreshToken } = req.cookies as AuthCookies;

  if (!refreshToken)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  const result = await usersService.update(refreshToken, req.body);

  res.status(200).json({
    message: "Profile successfully updated",
    data: result,
  });
};
