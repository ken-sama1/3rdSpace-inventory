import type { RefreshResBody } from "@repo/shared";
import type { Request, Response } from "express";
import { authService } from "../../services/auth/index.js";
import { COOKIE_OPTIONS } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import type { AuthCookies } from "../types/AuthCookies.js";

export const refresh = async (
  req: Request,
  res: Response<RefreshResBody>
): Promise<void> => {
  res.clearCookie("refreshToken");
  const cookies = req.cookies as AuthCookies;

  if (!cookies.refreshToken)
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Authentication required",
    });

  const { accessToken, refreshToken } = await authService.refresh(
    cookies.refreshToken
  );

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.status(200).json({
    data: {
      accessToken,
    },
    message: "success",
  });
};
