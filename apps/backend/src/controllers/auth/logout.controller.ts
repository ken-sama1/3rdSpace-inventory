import type { Request, Response } from "express";
import { authService } from "../../services/auth/index.js";
import { AppError } from "../../errors/AppError.js";
import type { AuthCookies } from "../types/AuthCookies.js";
import { API_ERROR_CODE_TO_MESSAGE } from "@repo/shared";

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies as AuthCookies;

  if (!cookies.refreshToken)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: API_ERROR_CODE_TO_MESSAGE["UNAUTHORIZED_ERROR"],
    });

  await authService.logout(cookies.refreshToken);

  res.clearCookie("refreshToken");

  res.sendStatus(204);
};
