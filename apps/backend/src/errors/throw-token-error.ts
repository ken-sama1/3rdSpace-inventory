import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";
import { AppError } from "./AppError.js";

export const throwTokenError = (error: unknown): never => {
  if (error instanceof TokenExpiredError) {
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token expired",
    });
  }

  if (error instanceof NotBeforeError) {
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Token is not active",
    });
  }

  if (error instanceof JsonWebTokenError) {
    throw new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Invalid token",
    });
  }

  throw error;
};
