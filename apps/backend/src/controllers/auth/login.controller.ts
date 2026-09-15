import type { LoginResBody, LoginSchema } from "@repo/shared";
import type { Request, Response } from "express";
import { authService } from "../../services/auth/index.js";
import { COOKIE_OPTIONS } from "../../config/constants.js";

export const login = async (
  req: Request<{}, LoginResBody, LoginSchema>,
  res: Response<LoginResBody>
): Promise<void> => {
  const { refreshToken, ...result } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.status(200).json({
    data: result,
    message: "Login successfull",
  });
};
