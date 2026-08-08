import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { ResponseError } from "@repo/shared";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ResponseError>,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });

    return;
  }

  res.status(500).json({
    message: "Internal server error",
    errors: [err],
  });
};
