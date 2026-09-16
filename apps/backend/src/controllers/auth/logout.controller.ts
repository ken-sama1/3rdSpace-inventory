import type { Request, Response } from "express";
import type { AuthCookies } from "./types.js";
import { authService } from "../../services/auth/index.js";
import { AppError } from "../../errors/AppError.js";

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies as AuthCookies;

  if (!cookies.refreshToken)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });

  await authService.logout(cookies.refreshToken);

  res.clearCookie("refreshToken");

  res.sendStatus(204);
};
