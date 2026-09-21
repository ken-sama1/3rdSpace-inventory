import { AppError } from "../../errors/AppError.js";
import type { AuthDecodedJwtPayload } from "../types/AuthJwtPayload.js";
import jwt from "jsonwebtoken";

export const decodeJwtPayload = (
  token: string,
  secretKey: string
): AuthDecodedJwtPayload => {
  try {
    return jwt.verify(token, secretKey) as AuthDecodedJwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError({
        code: "UNAUTHORIZED_ERROR",
        message: "Token expired",
      });
    }

    if (error instanceof jwt.NotBeforeError) {
      throw new AppError({
        code: "UNAUTHORIZED_ERROR",
        message: "Token is not active",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError({
        code: "UNAUTHORIZED_ERROR",
        message: "Invalid token",
      });
    }

    throw error;
  }
};
