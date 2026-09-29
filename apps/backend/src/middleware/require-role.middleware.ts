import type { UserRoleSchema } from "@repo/shared";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export const requireRole =
  (...roles: UserRoleSchema[]) =>
  (req: Request, _: Response, next: NextFunction): void => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      next(
        new AppError({
          code: "FORBIDDEN_ERROR",
          message: "You do not have permission to perform this action",
        })
      );
      return;
    }

    next();
  };
