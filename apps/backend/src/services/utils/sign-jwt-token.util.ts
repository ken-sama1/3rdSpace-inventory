import { API_ERROR_CODE_TO_MESSAGE } from "@repo/shared";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../constants.js";
import { AppError } from "../../errors/AppError.js";
import type { AuthJwtPayload } from "../types/AuthJwtPayload.js";

type TokenType = "access" | "refresh";

export const signJwtToken = (
  payload: AuthJwtPayload,
  type: TokenType
): string => {
  if (type === "access") {
    if (!ACCESS_TOKEN_SECRET)
      throw new AppError({
        code: "INTERNAL_ERROR",
        message: API_ERROR_CODE_TO_MESSAGE["INTERNAL_ERROR"],
      });

    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  }

  if (type === "refresh") {
    if (!REFRESH_TOKEN_SECRET)
      throw new AppError({
        code: "INTERNAL_ERROR",
        message: API_ERROR_CODE_TO_MESSAGE["INTERNAL_ERROR"],
      });

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  }

  throw new AppError({
    code: "INTERNAL_ERROR",
    message: API_ERROR_CODE_TO_MESSAGE["INTERNAL_ERROR"],
  });
};
